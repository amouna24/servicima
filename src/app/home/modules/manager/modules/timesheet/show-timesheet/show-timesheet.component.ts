import { IUserModel } from '@shared/models/user.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UploadService } from '@core/services/upload/upload.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UserService } from '@core/services/user/user.service';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
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
  hide = true;
  timesheet: any;
  haveImage: any;
  avatar: any;
  user: IUserModel;
  id: string;
  listettt: any;
  listTimesheet: ITimesheetModel[];
  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  subscriptions: Subscription;
  userInfo: IUserInfo;
  companyEmail: string;
  pending = 'Pending';
  rejected = 'Rejected';
  approved = 'Approved';

  constructor( public dialogRef: MatDialogRef<ShowTimesheetComponent>,
               private dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private uploadService: UploadService,
               private modalsServices: ModalService,
               private userService: UserService,
               private timesheetService: TimesheetService,
  ) { }

  async ngOnInit() {
    this.modalsServices.registerModals(
      { modalName: 'rejectTimesheet', modalComponent: RejectTimesheetComponent });
    this.timesheet = this.data;
    // console.log('this.timesheet', this.timesheet);
    this.avatar = await this.uploadService.getImage(this.timesheet.photo);
    // console.log('avatar:', this.avatar);
    this.getUserInfo();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  refresh() {
    this.timesheetService
      // tslint:disable-next-line:max-line-length
      .getTimesheet(`?application_id=${this.userService.applicationId}&company_email=${this.companyEmail}&timesheet_status=${this.pending}&timesheet_status=${ this.rejected }&timesheet_status=${this.approved}&inclusive=true`)
      .subscribe((items) => {
        this.listTimesheet = items;
        this.ELEMENT_DATA.next(items);
      });
  }

  /**
   * @description : get user Info
   */
  getUserInfo() {
    this.subscriptions = this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.userInfo = data;
          this.companyEmail = data.user[0]['company_email'];
        }
      });
  }

  rejectTimesheet() {
    this.onCloseClick();
    this.modalsServices.displayModal('rejectTimesheet', this.timesheet, '600px', '350px')
                       .subscribe((res) => {
                          console.log('tt', res);
                          this.refresh();
                          this.listettt = res;
                       });
  }

  approveTimesheet() {
    // console.log('this.approve', this.timesheet);
    this.onCloseClick();
    this.dialog.open(RejectTimesheetComponent, {
      width: '600px',
      height: '350px',
      data: { timesheet: this.timesheet , value: 'Approved' }
    });
  }

  getFile() {
  }
}
