import { Component, OnInit } from '@angular/core';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';

@Component({
  selector: 'wid-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss']
})
export class TimesheetsListComponent implements OnInit {
  panelOpenState = false;
  hide = true;
  listTimesheet: ITimesheetModel[] = [];

  constructor(private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.timesheetService.getTimesheet('').subscribe(
      data => {
        this.listTimesheet = data;
        console.log(this.listTimesheet);
      },
      error => console.log(error)
    );
  }

}
