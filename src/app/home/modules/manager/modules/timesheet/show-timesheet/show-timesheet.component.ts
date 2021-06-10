import { IUserModel } from '@shared/models/user.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UploadService } from '@core/services/upload/upload.service';
import { ModalService } from '@core/services/modal/modal.service';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';

import { RejectTimesheetComponent } from '../reject-timesheet/reject-timesheet.component';

@Component({
  selector: 'wid-show-timesheet',
  templateUrl: './show-timesheet.component.html',
  styleUrls: ['./show-timesheet.component.scss']
})
export class ShowTimesheetComponent implements OnInit {
  timesheet: any;
  haveImage: any;
  avatar: any;
  user: IUserModel;
  id: string;
  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  subscriptions: Subscription;
  userInfo: IUserInfo;
  rejected: boolean;
  approved: boolean;

  constructor( public dialogRef: MatDialogRef<ShowTimesheetComponent>,
               private dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private uploadService: UploadService,
               private modalsServices: ModalService,
  ) { }

  async ngOnInit() {
    this.modalsServices.registerModals({ modalName: 'rejectTimesheet', modalComponent: RejectTimesheetComponent });
    this.timesheet = this.data;
    console.log('timesheet', this.timesheet);
    this.avatar = await this.uploadService.getImage(this.timesheet.photo);
    this.statusButton();
  }

  /**
   * @description : disable button
   */
  statusButton() {
    if (this.timesheet.timesheet_status === 'Rejected') {
      return this.rejected = true;
    } else if (this.timesheet.timesheet_status === 'Approved') {
      return this.approved = true;
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  rejectTimesheet() {
    this.dialogRef.close('reject');
  }

  approveTimesheet() {
    this.dialogRef.close('approve');
  }

  getFile() {
  }
}
