import { IUserModel } from '@shared/models/user.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UploadService } from '@core/services/upload/upload.service';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-show-timesheet',
  templateUrl: './show-timesheet.component.html',
  styleUrls: ['./show-timesheet.component.scss']
})
export class ShowTimesheetComponent implements OnInit {
  timesheet: any;
  avatar: SafeUrl = 'assets/img/default.jpg';
  user: IUserModel;
  id: string;
  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  subscriptions: Subscription;
  userInfo: IUserInfo;
  week: any[] = [
    {
      day: 'MON',
      hours: this.data.monday,
    },
    {
      day: 'TUE',
      hours: this.data.tuesday,
    },
    {
      day: 'WED',
      hours: this.data.wednesday,
    },
    {
      day: 'THU',
      hours: this.data.thursday,
    },
    {
      day: 'FRI',
      hours: this.data.friday,
    },
    {
      day: 'SAT',
      hours: this.data.saturday,
    },
    {
      day: 'SUN',
      hours: this.data.sunday
    }];

  constructor(public dialogRef: MatDialogRef<ShowTimesheetComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private uploadService: UploadService,
              private router: Router
  ) {
  }

  async ngOnInit() {
    this.timesheet = this.data;
    await this.getAvatar();
  }

  getAvatar(): void {
    this.uploadService.getImage(this.timesheet.photo)
      .then((data) => {
        if (data) {
          this.avatar = data;
        }
      });
  }

  modalActions(action?: string) {
    if (action) {
      this.dialogRef.close(action);
    } else {
      this.dialogRef.close();
    }
  }
  updateTimesheet() {
    this.modalActions();
    this.router.navigate(
      ['/manager/timesheet/edit', this.timesheet.type_timesheet], {
        queryParams: {
          'id': btoa(this.timesheet._id.toString())
  }
});
  }
}
