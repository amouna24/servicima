import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  new = false;

  sortBy = [
    { value: 'Week start on-0', viewValue: 'Week start on'},
    { value: 'Total-1', viewValue: 'total'}
  ];

  constructor() { }

  ngOnInit() {
  }

  showHide() {
    this.new = !this.new;
  }
}
