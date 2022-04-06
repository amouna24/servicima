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
    if (this.data.type === 'min') {
      this.totalTime = this.data.time;
    } else if (this.data.type === 'sec') {
      this.totalTime = '1';
    } else if (this.data.type === 'h') {
      this.totalTime = (this.data.time * 60).toString();
    }
    console.log(this.data.totalTime);
    console.log('total time =', this.data.totalTime);
  }

}
