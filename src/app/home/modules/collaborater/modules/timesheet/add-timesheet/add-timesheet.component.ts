import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';

@Component({
  selector: 'wid-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})
export class AddTimesheetComponent implements OnInit {

  creationForm: FormGroup;

  constructor( private fb: FormBuilder,
                private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.creationForm = this.fb.group(
      {
        application_id : Math.random().toString(),
        email_address : 'iddssdd',
        company_email : 'idddssd',
        timesheet_week : 'iidssd',
        task_code : 'idd',
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

}
