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
  minDate = new Date(Date.now());
  mon = 0;
  tue = 0;
  wed = 0;
  totale = 0;
  thu: number;
  // total = (parseInt(this.mon).val()) + parseInt(this.thu).val());

  constructor( private fb: FormBuilder,
                private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.createForm();
    // this.creationForm.get('monday').valueChanges.subscribe((selectedValue: number) => {
    //   this.mon = selectedValue;
    // });
    // this.creationForm.get('tuesday').valueChanges.subscribe((selectedValue: number) => {
    //   this.tue = selectedValue;
    // });
    // this.creationForm.get('wednesday').valueChanges.subscribe((selectedValue: number) => {
    //   this.wed = selectedValue;
    // });
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
showTotal() {
  console.log(this.totale);
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

  total(): number {
    return this.mon + this.tue ;
  }
}
