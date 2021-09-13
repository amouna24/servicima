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
  reject: boolean;
  constructor(
    private dialogRef: MatDialogRef<RejectTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
  ) { }

  ngOnInit(): void {
    this.reject = this.data.action === 'Rejected';
  }

  /**
   * @description : get comment value
   * @param: event
   */
  getComment(event: any) {
    this.commentManager = event.target.value;
  }
  /**
   * @description : Initialize update object
   * @param: New status
   * @return: Promise<any>
   */
  async initUpdateStatus(): Promise<any> {
    return {
      application_id : this.data.timesheet.TimeSheetKey.application_id,
      email_address : this.data.timesheet.email_address,
      company_email : this.data.timesheet.company_email,
      project_code : this.data.timesheet.project_code,
      start_date : this.data.timesheet.start_date,
      end_date : this.data.timesheet.end_date,
      timesheet_status : this.data.action,
      comment : this.commentManager,
      monday : this.data.timesheet.monday,
      tuesday : this.data.timesheet.tuesday,
      wednesday : this.data.timesheet.wednesday,
      thursday : this.data.timesheet.thursday,
      friday : this.data.timesheet.friday,
      saturday : this.data.timesheet.saturday,
      sunday : this.data.timesheet.sunday,
      type_timesheet: this.data.timesheet.type_timesheet,
      total_week_hours : this.data.timesheet.total_week_hours
    };
  }

  /**
   * @description : reject timesheet
   * @param: status
   */
  responseTimesheet() {
    this.initUpdateStatus().then(
      (data) => {
        this.timesheetService.updateTimesheet(data).toPromise().then(
          res =>  this.dialogRef.close(this.data.action),
          error => console.log(error)
        );
      }
    );

  }

  /**
   * @description : close pop-up
   */
  onCloseClick(): void {
    this.dialogRef.close();
  }

}
