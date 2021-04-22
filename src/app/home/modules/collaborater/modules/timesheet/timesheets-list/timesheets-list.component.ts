import { Component, Input, OnInit } from '@angular/core';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
// import { startWith } from 'rxjs/operators/startWith';
// import { map } from 'rxjs/operators/map';

@Component({
  selector: 'wid-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss']
})
export class TimesheetsListComponent implements OnInit {
  @Input() bool: boolean;
  constructor(private timesheetService: TimesheetService) { }
  listTimesheet: ITimesheetModel[] = [];
  panelOpenState: boolean;

  togglePanel(item) {
    this.panelOpenState = !this.panelOpenState;
    console.log(item);
  }

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
