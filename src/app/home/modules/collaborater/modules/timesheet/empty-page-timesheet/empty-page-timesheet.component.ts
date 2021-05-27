import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wid-empty-page-timesheet',
  templateUrl: './empty-page-timesheet.component.html',
  styleUrls: ['./empty-page-timesheet.component.scss']
})
export class EmptyPageTimesheetComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EmptyPageTimesheetComponent>
  ) { }

  ngOnInit(): void {
  }

  /**
   * @description : close pop-up
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }

}
