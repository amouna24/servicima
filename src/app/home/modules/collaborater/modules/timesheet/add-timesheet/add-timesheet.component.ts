import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { ITimesheetProjectModel } from '@shared/models/timesheetProject.model';
import { ITimesheetTaskModel } from '@shared/models/timeshetTask.model';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import * as moment from 'moment';

@Component({
  selector: 'wid-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})
export class AddTimesheetComponent implements OnInit {
  @Input() timesheet: ITimesheetModel;
  close = true;
  creationForm: FormGroup;
  listTimesheetProject: ITimesheetProjectModel[] = [];
  listTimesheetTask: ITimesheetTaskModel[] = [];
  totalWeek: any;
  minDate = new Date(Date.now());

  constructor( private fb: FormBuilder,
                private timesheetService: TimesheetService) {
    // moment().subtract(7, 'days');
    // console.log('minDate', this.minDate);
    // const date = moment(this.minDate).format('MMMM d, YYYY');
    // console.log('d', date);
  }

  ngOnInit(): void {
    console.log('yr');
    // this.getTimesheet();
    this.getAllProjects();
    this.getAllTasks();
    // this.getTimesheet();
    this.createForm();
    // this.updateForm();
    // console.log(this.minDate);
    // console.log(this.timesheet);
  }

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
        application_id : Math.random().toString(),
        email_address : 'wid-email-address',
        company_email : 'wid-company-email',
        timesheet_week : 'wid-timesheet-week',
        task_code : 'wid-task-code',
        start_date : ['', Validators.required],
        end_date : 'wid-end-date',
        timesheet_status : 'wid-timesheet-status',
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

/*  updateForm() {
    console.log('time', this.timesheet);
    this.creationForm.patchValue({
        application_id : this.timesheet._id,
        email_address : this.timesheet.TimeSheetKey.email_address,
        company_email : this.timesheet.TimeSheetKey.company_email,
        timesheet_week : this.timesheet.TimeSheetKey.timesheet_week,
        task_code : this.timesheet.TimeSheetKey.task_code,
        start_date : [this.timesheet.start_date, Validators.required],
        end_date : this.timesheet.end_date,
        timesheet_status : this.timesheet.timesheet_status,
        comment : this.timesheet.comment,
        monday : this.timesheet.monday,
        tuesday : this.timesheet.tuesday,
        wednesday : this.timesheet.wednesday,
        thursday : this.timesheet.thursday,
        friday : this.timesheet.friday,
        saturday : this.timesheet.saturday,
        sunday : this.timesheet.sunday,
        total_week_hours : this.timesheet.total_week_hours,
        customer_timesheet : this.timesheet.customer_timesheet
    });
  }*/

  submitTimesheet() {
    console.log('valid ?', this.creationForm.valid);
    if (this.creationForm.valid) {
      console.log(this.creationForm.value);
      this.timesheetService.addTimesheet(this.creationForm.value).subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error)
      );
    }
  }

  saveTimesheet() {

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
  }
}
