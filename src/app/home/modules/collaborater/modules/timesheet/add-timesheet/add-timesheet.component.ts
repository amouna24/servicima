import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { ITimesheetProjectModel } from '@shared/models/timesheetProject.model';
import { ITimesheetTaskModel } from '@shared/models/timeshetTask.model';

@Component({
  selector: 'wid-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})
export class AddTimesheetComponent implements OnInit {
  close = true;
  creationForm: FormGroup;
  minDate = new Date(Date.now());
  listTimesheetProject: ITimesheetProjectModel[] = [];
  listTimesheetTask: ITimesheetTaskModel[] = [];
  totalWeek: any;

  constructor( private fb: FormBuilder,
                private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.createForm();
    this.getAllProjects();
    this.getAllTasks();
  }

  getAllProjects() {
    this.timesheetService.getTimesheetProject('').subscribe(
      data => {
        this.listTimesheetProject = data;
        console.log(this.listTimesheetProject);
      },
      error => console.log(error)
    );
  }

  getAllTasks() {
    this.timesheetService.getTimesheetTask('').subscribe(
      data => {
        this.listTimesheetTask = data;
        console.log(this.listTimesheetTask);
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
        end_date : 'tt',
        timesheet_status : 'draft',
        comment : '',
        monday : '',
        tuesday : '',
        wednesday : '',
        thursday : '',
        friday : '',
        saturday : '',
        sunday : '',
        total_week_hours : '',
        customer_timesheet : ''
      }
    );
  }

  createTimesheet(formDirective: FormGroupDirective) {
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

  closeClick(): void {
    this.close = !this.close;
  }
  calculTotal() {
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
