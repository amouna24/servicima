import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss']
})
export class TimesheetsListComponent implements OnInit {
  panelOpenState = false;
  hide = true;

  constructor() { }

  ngOnInit(): void {
  }

}
