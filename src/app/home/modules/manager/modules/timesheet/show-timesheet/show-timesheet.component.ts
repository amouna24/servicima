import { IUserModel } from '@shared/models/user.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UploadService } from '@core/services/upload/upload.service';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-show-timesheet',
  templateUrl: './show-timesheet.component.html',
  styleUrls: ['./show-timesheet.component.scss']
})
export class ShowTimesheetComponent implements OnInit {
  timesheet: ITimesheetModel | any;
  avatar: SafeUrl;
  user: IUserModel;
  id: string;
  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  subscriptions: Subscription;
  userInfo: IUserInfo;
  userPosition = '';
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
              private router: Router,
              private refData: RefdataService,
              private userService: UserService,
  ) {
  }

  async ngOnInit() {
    this.timesheet = this.data;
    await this.getAvatar();
    this.getJobTitle();
  }

  getAvatar(): void {
    const getPic = (id) => {
      this.uploadService.getImage(id)
        .then((data) => {
          if (data) {
            this.avatar = data;
          }
        });
    };
    if (typeof this.timesheet.photo !== 'object' && this.timesheet.photo) {
      getPic(this.timesheet.photo);
    } else if (this.timesheet.photo.url) {
        this.avatar = this.timesheet.photo.url;
      } else if (this.timesheet.photo.src) {
      getPic(this.timesheet.photo.src);
    }
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

  getJobTitle() {
    const find = (refData, refCode) =>
      refData.some( (col) => col.value === refCode) ?
        refData.find( (col) => col.value === refCode) : refCode;
    if (this.timesheet) {
      this.userService.connectedUser$.subscribe(
        (data) => {
          this.refData.getRefData(data.company._id, this.userService.applicationId, ['TIMESHEET_TYPE']).then(
            (res) => {
              this.userPosition = find(res['PROF_TITLES'], this.timesheet.user_position).viewValue;
              this.timesheet.type_timesheet = find(res['TIMESHEET_TYPE'], this.timesheet.type_timeshee);
              console.log(res);
            }
          );
        });
    } else {
      this.getJobTitle();
    }
  }
}
