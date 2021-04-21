import { Component, OnInit } from '@angular/core';

import { AddTimesheetComponent } from '../../../../home/modules/collaborater/modules/timesheet/add-timesheet/add-timesheet.component';

@Component({
  selector: 'wid-timesheet-filter',
  templateUrl: './timesheet-filter.component.html',
  styleUrls: ['./timesheet-filter.component.scss']
})
export class TimesheetFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
