import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { Router } from '@angular/router';
import { IUserInfo } from '@shared/models/userInfo.model';

@Component({
  selector: 'wid-reject-timesheet',
  templateUrl: './reject-timesheet.component.html',
  styleUrls: ['./reject-timesheet.component.scss']
})
export class RejectTimesheetComponent implements OnInit {
  commentManager: string;
  timesheetToUpdate: any;
  approvedButton: string;
  companyEmail: string;
  pending = 'Pending';
  rejected = 'Rejected';
  approved = 'Approved';
  listTimesheet: ITimesheetModel[];
  subscriptions: Subscription;
  userInfo: IUserInfo;
  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  openApproveComponent = new BehaviorSubject<{ opened: boolean, value: string}>({ opened: false, value: this.approvedButton});

  constructor(
    private dialogRef: MatDialogRef<RejectTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.openApproveComponent.next({ opened: false, value: this.data.value});
    this.getUserInfo();
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
    // console.log('this.data.timesheet', this.data.timesheet);
    this.timesheetToUpdate = {
      application_id : this.data.TimeSheetKey.application_id,
      email_address : this.data.email_address,
      company_email : this.data.company_email,
      timesheet_week : this.data.timesheet_week,
      project_code : this.data.project_code,
      start_date : this.data.start_date,
      end_date : this.data.end_date,
      timesheet_status : 'Rejected',
      comment : this.commentManager,
      monday : this.data.monday,
      tuesday : this.data.tuesday,
      wednesday : this.data.wednesday,
      thursday : this.data.thursday,
      friday : this.data.friday,
      saturday : this.data.saturday,
      sunday : this.data.sunday,
      total_week_hours : this.data.total_week_hours,
      customer_timesheet : this.data.customer_timesheet
    };

    this.timesheetService.updateTimesheet(this.timesheetToUpdate).subscribe(
      data => { console.log(data);
        this.refresh(this.data);
        this.onCloseClick(); },
      error => console.log(error)
    );
  }

  approveTimesheet() {
    // console.log('this.data.timesheet', this.data.timesheet);
    this.timesheetToUpdate = {
      application_id : this.data.timesheet.TimeSheetKey.application_id,
      email_address : this.data.timesheet.email_address,
      company_email : this.data.timesheet.company_email,
      timesheet_week : this.data.timesheet.timesheet_week,
      project_code : this.data.timesheet.project_code,
      start_date : this.data.timesheet.start_date,
      end_date : this.data.timesheet.end_date,
      timesheet_status : 'Approved',
      comment : this.data.timesheet.comment,
      monday : this.data.timesheet.monday,
      tuesday : this.data.timesheet.tuesday,
      wednesday : this.data.timesheet.wednesday,
      thursday : this.data.timesheet.thursday,
      friday : this.data.timesheet.friday,
      saturday : this.data.timesheet.saturday,
      sunday : this.data.timesheet.sunday,
      total_week_hours : this.data.timesheet.total_week_hours,
      customer_timesheet : this.data.timesheet.customer_timesheet
    };

    // console.log('this.timesheetToUpdate', this.timesheetToUpdate);
    this.timesheetService.updateTimesheet(this.timesheetToUpdate).subscribe(
      data => {
        console.log(data);
        this.onCloseClick();
        this.refresh(this.data);
        },
      error => console.log(error)
    );
  }

  refresh(data) {
    this.timesheetService
      // tslint:disable-next-line:max-line-length
      .getTimesheet(`?application_id=${this.userService.applicationId}&company_email=${this.companyEmail}&timesheet_status=${this.pending}&timesheet_status=${ this.rejected }&timesheet_status=${this.approved}&inclusive=true`)
      .subscribe((items) => {
        this.listTimesheet = items;
        this.ELEMENT_DATA.next(items);
        console.log(items, 'dh');
      });
  }

  onCloseClick(): void {
    this.dialogRef.close(this.listTimesheet);
  }

  getComment(event: any) {
    this.commentManager = event.target.value;
    // console.log(this.commentManager);
  }
}
