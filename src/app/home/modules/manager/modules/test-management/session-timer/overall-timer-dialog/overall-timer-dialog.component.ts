import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wid-overall-timer-dialog',
  templateUrl: './overall-timer-dialog.component.html',
  styleUrls: ['./overall-timer-dialog.component.scss']
})
export class OverallTimerDialogComponent implements OnInit {
  totalTime: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.totalTime = this.data.totalTime.time;
  }

}
