import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { ITimesheetProjectModel } from '@shared/models/timesheetProject.model';
import { ITimesheetTaskModel } from '@shared/models/timeshetTask.model';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IViewParam } from '@shared/models/view.model';
// import * as moment from 'moment';

@Component({
  selector: 'wid-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})
export class AddTimesheetComponent implements OnInit {
  @Input() timesheet: ITimesheetModel;
  // minDate = new Date(Date.now());
  close = true;
  creationForm: FormGroup;
  listTimesheetProject: ITimesheetProjectModel[] = [];
  listTimesheetTask: ITimesheetTaskModel[] = [];
  totalWeek: any;
  userInfo: IUserInfo;
  companyEmail: string;
  refData: { } = { };
  categoryList: IViewParam[];
  subscriptions: Subscription;

  constructor( private fb: FormBuilder,
               private timesheetService: TimesheetService,
               private userService: UserService,
               private refDataService: RefdataService,
               private utilService: UtilsService ) {
/*    moment().subtract(7, 'days');
    console.log('minDate', this.minDate);
    const date = moment(this.minDate).format('MMMM d, YYYY');
    console.log('d', date);*/
  }

  async ngOnInit() {
    this.getAllProjects();
    this.getAllTasks();
    this.getUserInfo();
    this.createForm();
    await this.getRefDataCategory();
    // this.getTimesheet();
    // this.updateForm();
    // console.log(this.minDate);
    // console.log(this.timesheet);
  }

  getUserInfo() {
    this.subscriptions = this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.userInfo = data;
          console.log('user info:', data);
          this.companyEmail = data.user[0]['company_email'];
          // console.log('company email', this.companyEmail);
        }
    });
  }

  async getRefdata() {
    const list = ['TIMESHEET_STATE', 'TIMESHEET_CATEGORY_TASK'];
    this.refData =  await this.refDataService
      .getRefData( this.utilService.getCompanyId(this.companyEmail, this.userService.applicationId) , this.userService.applicationId,
        list, false);
    return this.refData;
  }

  async getRefDataCategory() {
    const data = await this.getRefdata();
    console.log('getrefatatimesheet', data);
    this.categoryList = data['TIMESHEET_CATEGORY_TASK'];
    console.log('categoryList', this.categoryList);
  }

  getAllProjects() {
    this.timesheetService.getTimesheetProject('').subscribe(
      data => {
        this.listTimesheetProject = data;
      },
      error => console.log(error)
    );
  }

  getAllTasks() {
    this.timesheetService.getTimesheetTask('').subscribe(
      data => {
        this.listTimesheetTask = data;
      },
      error => console.log(error)
    );
  }

  createForm() {
    this.creationForm = this.fb.group(
      {
        application_id : this.userService.applicationId,
        email_address : this.userService.emailAddress,
        company_email :  this.companyEmail,
        timesheet_week : 'wid-timesheet-week',
        task_code : Math.random().toString(),
        start_date : ['', Validators.required],
        end_date : 'wid-end-date',
        timesheet_status : '',
        comment : '',
        monday : '',
        tuesday : '',
        wednesday : '',
        thursday : '',
        friday : '',
        saturday : '',
        sunday : '',
        total_week_hours : '',
        customer_timesheet : 'wid-customer-timesheet'
      }
    );
  }

  submitTimesheet(value) {
    if (this.creationForm.valid) {
      if (value === 'submit') {
        this.creationForm.patchValue({ timesheet_status : 'Pending' });
      } else if (value === 'save') {
        this.creationForm.patchValue({ timesheet_status : 'Draft' });
      }
      this.timesheetService.addTimesheet(this.creationForm.value).subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error)
      );
    }
  }

  deleteTimesheet() {

  }

  closeClick(): void {
    this.close = !this.close;
  }

  calculTotalWeekHours() {
    const mondayValue = this.creationForm.value.monday;
    const tuesdayValue = this.creationForm.value.tuesday;
    const wednesdayValue = this.creationForm.value.wednesday;
    const thursdayValue = this.creationForm.value.thursday;
    const fridayValue = this.creationForm.value.friday;
    const saturdayValue = this.creationForm.value.saturday;
    const sundayValue = this.creationForm.value.sunday;

    this.totalWeek = mondayValue + tuesdayValue + wednesdayValue + thursdayValue + fridayValue + saturdayValue + sundayValue;
    this.creationForm.controls['total_week_hours'].setValue(this.totalWeek);
  }

  /*
  getTimesheet() {
    console.log('this', this.timesheet);
    this.timesheetService.getTimesheet(this.timesheet._id).subscribe(
      data => {
        this.timesheet = data[0];
        console.log('this', this.timesheet);
        console.log(this.timesheet.comment);
      },
      error => console.log(error)
    );
  }
*/

}
