import { Component, Input, OnInit } from '@angular/core';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators/map';
import { ITimesheetProjectModel } from '@shared/models/timesheetProject.model';
import { ITimesheetTaskModel } from '@shared/models/timeshetTask.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'wid-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss']
})
export class TimesheetsListComponent implements OnInit {
  show = false;
  listTimesheet: ITimesheetModel[] = [];
  panelOpenState: boolean;
  timesheet: ITimesheetModel;
  object: string;
  openEditComponent = new BehaviorSubject<{ opened: boolean, index: number}>({ opened: false, index: -1});
  myControl: FormControl = new FormControl();
  options = ['Hello', 'Oui', 'Non'];
  filteredOptions: Observable<string[]>;
  listTimesheetProject: ITimesheetProjectModel[] = [];
  listTimesheetTask: ITimesheetTaskModel[] = [];
  initialForm: FormGroup;
  totalWeek: any;

  constructor(private timesheetService: TimesheetService,
              private fb: FormBuilder) { }

  sortBy = [
    { value: 'Week start on-0', viewValue: 'Week start on'},
    { value: 'Total-1', viewValue: 'total'}
  ];

  ngOnInit(): void {
    this.getTimesheets();
    this.getAllProjects();
    this.getAllTasks();
    this.filterOptions();
    this.createForm();
    // this.updateForm();
  }

  filterOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  }

  filter(val: string): string[] {
    return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  createForm() {
    this.initialForm = this.fb.group(
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

  updateForm() {
    console.log('this.timesheet', this.timesheet);
    this.initialForm.patchValue({
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
  }

  submitTimesheet(formDirective: FormGroupDirective) {
    if (this.initialForm.valid) {
      console.log(this.initialForm.value);
      this.timesheetService.addTimesheet(this.initialForm.value).subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error)
      );
    } else {
      console.log('error');
    }
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

  showHide() {
    this.show = !this.show;
  }

  closeClick(panel) {
    this.openEditComponent.next({ opened: false, index: -1});
    this.togglePanel(panel);
  }

  getTimesheets() {
    this.timesheetService.getTimesheet('').subscribe(
      data => {
        this.listTimesheet = data;
        console.log(this.listTimesheet);
      },
      error => console.log(error)
    );
  }

  togglePanel(panel: any) {
    panel.expanded = !panel.expanded;
  }

  editTimesheet(item, index, panel) {
    this.timesheet = item;
    this.openEditComponent.next({ opened: true, index});
    this.updateForm();
    this.togglePanel(panel);
    console.log(this.timesheet);
  }

  generatePdf() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).open();
  }

  getDocumentDefinition() {
  }

  calculTotalWeekHours() {
    const mondayValue = this.initialForm.value.monday;
    const tuesdayValue = this.initialForm.value.tuesday;
    const wednesdayValue = this.initialForm.value.wednesday;
    const thursdayValue = this.initialForm.value.thursday;
    const fridayValue = this.initialForm.value.friday;
    const saturdayValue = this.initialForm.value.saturday;
    const sundayValue = this.initialForm.value.sunday;

    this.totalWeek = mondayValue + tuesdayValue + wednesdayValue + thursdayValue + fridayValue + saturdayValue + sundayValue;
  }

}
