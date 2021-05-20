import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { ITimesheetProjectModel } from '@shared/models/timesheetProject.model';
import { UserService } from '@core/services/user/user.service';
import { Subject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IViewParam } from '@shared/models/view.model';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import * as moment from 'moment';

@Component({
  selector: 'wid-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})

export class AddTimesheetComponent implements OnInit {
  close = true;
  initialForm: FormGroup;
  listTimesheetProject: ITimesheetProjectModel[] = [];
  totalWeek: number;
  userInfo: IUserInfo;
  companyEmail: string;
  refData: { } = { };
  categoryList: IViewParam[];
  subscriptions: Subscription;
  projectName: string;
  projectCode: string;
  startDate: string;
  categoryCode = '';
  categoryViewValue = '';
  timesheet = this.router.getCurrentNavigation().extras.state.data;
  buttonValue = this.router.getCurrentNavigation().extras.state.buttonClicked;
  destroy$: Subject<boolean> = new Subject<boolean>();
  listTimesheet: ITimesheetModel[] = [];
  private subscriptionModal: Subscription;

  constructor( private fb: FormBuilder,
               private timesheetService: TimesheetService,
               private userService: UserService,
               private refDataService: RefdataService,
               private utilService: UtilsService,
               private location: Location,
               private router: Router,
               private modalServices: ModalService,
               ) {
  }

  async ngOnInit() {
    this.getAllProjects();
    this.getUserInfo();
    this.createForm();
    await this.getRefDataCategory();
    this.executeUpdateForm();
  }

  getProjectByName() {
    this.timesheetService
        .getTimesheetProject(`?project_desc=${this.projectName}`)
        .subscribe(
        res => {
          // console.log('onProjectSelect', res);
          // console.log('projectCode', res[0].TimesheetProjectKey.project_code);
          this.projectCode = res[0].TimesheetProjectKey.project_code;
          this.categoryCode = res[0].category_code;
          this.categoryList.forEach( (data) => {
            if (data.value === this.categoryCode) {
              this.categoryViewValue = data.viewValue;
              // console.log('data', data.viewValue);
            }
          });
        },
        error => console.log(error)
      );
  }

  onProjectSelect(prj) {
    // console.log(prj.value);
    this.projectName = prj.value;
    this.getProjectByName();
  }

  getAllProjects() {
    this.timesheetService.getTimesheetProject('').subscribe(
      data => { this.listTimesheetProject = data; },
      error => console.log(error)
    );
  }

  getUserInfo() {
    this.subscriptions = this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.userInfo = data;
          // console.log('user info:', data);
          this.companyEmail = data.user[0]['company_email'];
          // console.log('company email', this.companyEmail);
        }
    });
  }

  async getRefdata() {
    const list = ['TIMESHEET_STATE', 'TIMESHEET_PROJECT_CATEGORY'];
    this.refData =  await this.refDataService
        .getRefData( this.utilService.getCompanyId(this.companyEmail, this.userService.applicationId) , this.userService.applicationId, list, false);
    return this.refData;
  }

  async getRefDataCategory() {
    const data = await this.getRefdata();
    this.categoryList = data['TIMESHEET_PROJECT_CATEGORY'];
  }

  createForm() {
    this.initialForm = this.fb.group(
      {
        application_id : this.userService.applicationId,
        email_address : this.userService.emailAddress,
        company_email :  this.companyEmail,
        timesheet_week : [''],
        project_code : ['', [Validators.required]],
        start_date : ['', [Validators.required]],
        end_date : [''],
        timesheet_status : [''],
        comment : [''],
        monday : [0, [Validators.min(0), Validators.max(24), Validators.required] ],
        tuesday : [0, [Validators.min(0), Validators.max(24), Validators.required ] ],
        wednesday : [0, [Validators.min(0), Validators.max(24), Validators.required] ],
        thursday : [0, [Validators.min(0), Validators.max(24), Validators.required] ],
        friday : [0, [Validators.min(0), Validators.max(24), Validators.required] ],
        saturday : [0, [Validators.min(0), Validators.max(24), Validators.required] ],
        sunday : [0, [Validators.min(0), Validators.max(24), Validators.required] ],
        total_week_hours : [0],
        customer_timesheet : 'wid-customer-timesheet'
      }
    );
  }

  updateForm() {
    this.initialForm.patchValue({
      application_id: this.timesheet.TimeSheetKey.application_id,
      email_address: this.timesheet.TimeSheetKey.email_address,
      company_email: this.timesheet.TimeSheetKey.company_email,
      timesheet_week: this.timesheet.TimeSheetKey.timesheet_week,
      project_code: '',
      start_date: this.timesheet.start_date,
      end_date: this.timesheet.end_date,
      timesheet_status: this.timesheet.timesheet_status,
      comment: this.timesheet.comment,
      monday: this.timesheet.monday,
      tuesday: this.timesheet.tuesday,
      wednesday: this.timesheet.wednesday,
      thursday: this.timesheet.thursday,
      friday: this.timesheet.friday,
      saturday: this.timesheet.saturday,
      sunday: this.timesheet.sunday,
      total_week_hours: this.timesheet.total_week_hours,
      customer_timesheet: this.timesheet.customer_timesheet,
    });
    this.projectCode = this.timesheet.TimeSheetKey.project_code;
    this.timesheetService.getTimesheetProject(`?project_code=${this.projectCode}`).subscribe(
      data => {
        this.projectName = data[0].project_desc;
        this.initialForm.patchValue({ project_code : this.projectName });
        this.categoryViewValue = data[0].category_code;
      },
      error => {
          console.log(error);
        }
    );
  }

  executeUpdateForm() {
    if (this.buttonValue === 'edit') {
      this.updateForm();
    }
  }

  submitTimesheet(value) {
    if (this.initialForm.valid) {
      if (value === 'submit') {
        this.initialForm.patchValue({ timesheet_status : 'Pending' });
      } else if (value === 'save') {
        this.initialForm.patchValue({ timesheet_status : 'Draft' });
      }
      this.initialForm.patchValue({ timesheet_week: this.initialForm.value.start_date});
      this.initialForm.patchValue({ project_code: this.projectCode});
      this.initialForm.patchValue({ end_date: moment(this.initialForm.value.start_date).add(7, 'day').format('LL')});

      this.timesheetService
          .addTimesheet(this.initialForm.value)
          .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['/collaborator/timesheet']);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  editTimesheet() {
    if (this.initialForm.valid) {
      this.timesheet.application_id = this.timesheet.TimeSheetKey.application_id;
      this.timesheet.comment = this.initialForm.value.comment;
      this.timesheet.monday = this.initialForm.value.monday;
      this.timesheet.tuesday = this.initialForm.value.tuesday;
      this.timesheet.wednesday = this.initialForm.value.wednesday;
      this.timesheet.thursday = this.initialForm.value.thursday;
      this.timesheet.friday = this.initialForm.value.friday;
      this.timesheet.saturday = this.initialForm.value.saturday;
      this.timesheet.sunday = this.initialForm.value.sunday;
      this.timesheet.total_week_hours = this.initialForm.value.total_week_hours;
      this.timesheetService.updateTimesheet(this.timesheet).subscribe(
        data => {
          console.log(data);
          this.router.navigate(['/collaborator/timesheet']);
          },
        error => console.log(error)
      );
    }
  }

  deleteTimesheet() {
    const confirmation = {
      code: 'delete',
      title: 'delete timesheet',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {
            // console.log(this.timesheet._id);
            this.timesheetService.deleteTimesheet(this.timesheet._id)
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(
                (res1) => {
                  this.timesheetService.getTimesheet(
                    // tslint:disable-next-line:max-line-length
                    `?application_id=${this.userService.applicationId}&email_address=${this.userService.emailAddress}&company_email=${this.companyEmail}`
                  ).subscribe((data) => {
                    this.router.navigate(['/collaborator/timesheet']);
                    this.refresh(data);
                  });
                }
              );
            this.subscriptionModal.unsubscribe();
          }
        }
      );
  }

  calculTotalWeekHours() {
    this.totalWeek = 0;
    const mondayValue = parseInt(this.initialForm?.value?.monday ? this.initialForm?.value?.monday : 0, 10);
    const tuesdayValue = parseInt(this.initialForm?.value?.tuesday ? this.initialForm?.value?.tuesday : 0, 10);
    const wednesdayValue = parseInt(this.initialForm?.value?.wednesday ? this.initialForm?.value?.wednesday : 0, 10);
    const thursdayValue = parseInt(this.initialForm?.value?.thursday ? this.initialForm?.value?.thursday : 0, 10);
    const fridayValue = parseInt(this.initialForm?.value?.friday ? this.initialForm?.value?.friday : 0, 10);
    const saturdayValue = parseInt(this.initialForm?.value?.saturday ? this.initialForm?.value?.saturday : 0, 10);
    const sundayValue = parseInt(this.initialForm?.value?.sunday ? this.initialForm?.value?.sunday : 0, 10);

    this.totalWeek =  mondayValue + tuesdayValue + wednesdayValue + thursdayValue + fridayValue + saturdayValue + sundayValue;
    this.initialForm.controls['total_week_hours'].setValue(this.totalWeek);
  }

  backClicked() {
    this.location.back();
  }

  resetClick() {
    this.initialForm.get('start_date').setValue(null);
    this.initialForm.get('project_code').setValue(null);
    this.initialForm.get('comment').setValue(null);

    this.initialForm.get('monday').setValue(0);
    this.initialForm.get('tuesday').setValue(0);
    this.initialForm.get('wednesday').setValue(0);
    this.initialForm.get('thursday').setValue(0);
    this.initialForm.get('friday').setValue(0);
    this.initialForm.get('saturday').setValue(0);
    this.initialForm.get('sunday').setValue(0);
    this.initialForm.get('total_week_hours').setValue(0);
  }

  refresh(data) {
    this.timesheetService
        .getTimesheet(
          `?application_id=${this.userService.applicationId}&email_address=${this.userService.emailAddress}&company_email=${this.companyEmail}`
        )
        .subscribe((items) => {
        this.listTimesheet = items;
        console.log('timesheet of refresh', this.listTimesheet); });
  }

}
