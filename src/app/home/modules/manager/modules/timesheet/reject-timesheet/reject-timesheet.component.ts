import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
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
  subscriptions: Subscription;
  userInfo: IUserInfo;
  openApproveComponent = new BehaviorSubject<{ opened: boolean, value: string}>({ opened: false, value: this.approvedButton});

  constructor(
    private dialogRef: MatDialogRef<RejectTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
    private userService: UserService,
    // private router: Router
  ) { }

  ngOnInit(): void {
    // console.log(this.data, 'daaataaa');
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

  /**
   * @description : get comment value
   */
  getComment(event: any) {
    this.commentManager = event.target.value;
  }

  /**
   * @description : reject timesheet
   */
  rejectTimesheet() {
    console.log(this.data, 'rejected');
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
      type_timesheet: this.data.type_timesheet,
      total_week_hours : this.data.total_week_hours,
      customer_timesheet : this.data.customer_timesheet
    };

    this.timesheetService.updateTimesheet(this.timesheetToUpdate).subscribe(
      data => { console.log(data);
        this.dialogRef.close('reject');
        },
      error => console.log(error)
    );
  }

  /**
   * @description : approve timesheet
   */
  approveTimesheet() {
    console.log(this.data, 'approuved');
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
      type_timesheet: this.data.timesheet.type_timesheet,
      total_week_hours : this.data.timesheet.total_week_hours,
      customer_timesheet : this.data.timesheet.customer_timesheet
    };

    this.timesheetService.updateTimesheet(this.timesheetToUpdate).subscribe(
      data => {
        console.log(data);
        this.dialogRef.close('approve');
        },
      error => console.log(error)
    );
  }

  /**
   * @description : close pop-up
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }

}
