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
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})

export class AddTimesheetComponent implements OnInit {
  initialForm: FormGroup;
  listTimesheetProject: ITimesheetProjectModel[] = [];
  totalWeek: number;
  userInfo: IUserInfo;
  companyEmail: string;
  companyId: string;
  languageId: string;
  refData: { } = { };
  categoryList: IViewParam[];
  projectName: string;
  projectCode: string;
  startDate: string;
  categoryCode = '';
  categoryViewValue = '';
  timesheet = this.router.getCurrentNavigation().extras.state.data;
  buttonValue = this.router.getCurrentNavigation().extras.state.buttonClicked;
  statusTimesheet = this.router.getCurrentNavigation().extras.state.statusTimesheet;
  typeTimesheet: string;
  date: Date;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  /** subscription */
  subscriptionModal: Subscription;
  subscriptions: Subscription;
  startDateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day === 1;
  };

  constructor( private fb: FormBuilder,
               private timesheetService: TimesheetService,
               private userService: UserService,
               private refDataService: RefdataService,
               private utilService: UtilsService,
               private location: Location,
               private router: Router,
               private activeRoute: ActivatedRoute,
               private modalServices: ModalService
               ) {
  }

  async ngOnInit() {
    this.getTimesheetType();
    this.getUserInfo();
    this.createForm();
    await this.getRefDataCategory();
    this.updateForm();
  }

  getTimesheetType(): void {
    this.typeTimesheet = this.activeRoute.snapshot.params.type;
  }

  /**
   * @description : get project by name
   */
  getProjectByName() {
    this.timesheetService
        .getTimesheetProject(this.companyEmail)
        .subscribe(
        res => {
          this.projectCode = res[0].TimesheetProjectKey.project_code;
          this.categoryCode = res[0].category_code;
          this.categoryList.forEach( (data) => {
            if (data.value === this.categoryCode) {
              this.categoryViewValue = data.viewValue;
            }
          });
        },
        error => console.log(error)
      );
  }

  /**
   * @description : get value of selected project
   */
  onProjectSelect(project) {
    this.projectName = project.value;
    this.getProjectByName();
  }

  /**
   * @description : get user info
   */
  getUserInfo() {
    this.subscriptions = this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.companyEmail = data.user[0]['company_email'];
          this.languageId = data.user[0].language_id;
        }
    });
  }

  /**
   * @description : get ref data
   */
  async getRefdata() {
    const list = ['TIMESHEET_STATE', 'TIMESHEET_PROJECT_CATEGORY'];
    this.refData =  await this.refDataService
        .getRefData( this.utilService.getCompanyId(this.companyEmail, this.userService.applicationId) , this.userService.applicationId, list, false);
    return this.refData;
  }

  /**
   * @description : get ref data category
   */
  async getRefDataCategory() {
    const data = await this.getRefdata();
    this.categoryList = data['TIMESHEET_PROJECT_CATEGORY'];
  }

  /**
   * @description : create form timesheet
   */
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
        monday : [0, [Validators.min(0), Validators.max(8), Validators.required] ],
        tuesday : [0, [Validators.min(0), Validators.max(8), Validators.required ] ],
        wednesday : [0, [Validators.min(0), Validators.max(8), Validators.required] ],
        thursday : [0, [Validators.min(0), Validators.max(8), Validators.required] ],
        friday : [0, [Validators.min(0), Validators.max(8), Validators.required] ],
        saturday : [0, [Validators.min(0), Validators.max(8), Validators.required] ],
        sunday : [0, [Validators.min(0), Validators.max(8), Validators.required] ],
        total_week_hours : [0],
        type_timesheet : [''],
        customer_timesheet : 'wid-customer-timesheet',
        collaborator_email: this.userService.emailAddress,
        language_id: this.languageId,
        company_id: this.utilService.getCompanyId('ALL', this.utilService.getApplicationID('ALL')),
      }
    );
  }

  /**
   * @description : update form timesheet
   */
  updateForm() {
    if ( this.buttonValue === 'edit' ) {
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
  }

  /**
   * @description : submit timesheet
   * @param value: 'submit' or 'save'
   */
  submitTimesheet(value) {
    if (this.initialForm.valid) {
      this.initialForm.patchValue({
        timesheet_status : value === 'submit' ? 'Pending' : 'save' ? 'Draft' : '',
        type_timesheet : this.typeTimesheet === 'extra' ? 'TIMESHEET_EXTRA' : 'TIMESHEET',
        imesheet_week: this.initialForm.value.start_date,
        project_code: this.projectCode
      });
      const endDate = new Date(this.initialForm.value.start_date);
      const date = endDate.setDate(endDate.getDate() + 7);
      this.initialForm.patchValue({ end_date: endDate});
      const confirmation = {
        code: 'add',
        title: `${value} timesheet`,
        description: `Are you sure you want to ${value} your timesheet?`,
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .pipe( takeUntil( this.destroy$) )
        .subscribe( (res) => {
          // console.log('destroy', this.destroy$);
          // ADD_TIMESHEET
          if ( res === true ) {
            // console.log('this.initialForm.value', this.initialForm.value);
            this.timesheetService.addTimesheet(this.initialForm.value).pipe(
              takeUntil(this.destroy$)
            ).subscribe(
              (data) => {
                console.log(data);
                this.router.navigate(['/collaborator/timesheet']);
              },

              // ERROR
              (error) => {
                console.log('error', error);
              }
            );
          }
          this.subscriptionModal.unsubscribe();
        });
    }
  }

  /**
   * @description : update timesheet
   */
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

      const confirmation = {
        code: 'edit',
        title: 'edit your timesheet',
        description: 'Are you sure you want to edit your timesheet?'
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '528px', '300px')
        .pipe( takeUntil( this.destroy$) )
        .subscribe( (res) => {
          if (res === true) {
            this.timesheetService.updateTimesheet(this.timesheet).pipe(
              takeUntil(this.destroy$)
            ).subscribe(
              (data) => {
                console.log(data);
                this.router.navigate(['/collaborator/timesheet']);
              },
              error => console.log(error)
            );
          }
          this.subscriptionModal.unsubscribe();
        });
    }
  }

  /**
   * @description : delete timesheet
   */
  deleteTimesheet() {
    const confirmation = {
      code: 'delete',
      title: 'delete timesheet',
      description: `Are you sure you want to delete your timesheet?`,

    };

    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {
            this.timesheetService.deleteTimesheet(this.timesheet._id)
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(
                (data) => {
                  console.log(data, 'data');
                  this.router.navigate(['/collaborator/timesheet']);
                }
              );
            this.subscriptionModal.unsubscribe();
          }
        }
      );
  }

  /**
   * @description : calcul total hours of the week
   */
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

  /**
   * @description back click
   */
  backClicked() {
    this.location.back();
  }
}
