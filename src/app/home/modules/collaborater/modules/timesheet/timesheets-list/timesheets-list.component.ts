import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ModalService } from '@core/services/modal/modal.service';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'wid-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss']
})

export class TimesheetsListComponent implements OnInit, OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(true);
  companyEmail: string;
  subscriptions: Subscription;
  userInfo: IUserInfo;
  redirectUrl: string;
  typeTimesheet: string;
  subscriptionModal: Subject<boolean>;
  subscriptionDeleteModal: Subscription;
  nbtItems = new BehaviorSubject<number>(5);
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private timesheetService: TimesheetService,
              private fb: FormBuilder,
              private modalService: ModalService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              ) {
  }

  /**
   * @description Set all functions that needs to be loaded on component init
   */
  ngOnInit(): void {
    this.getUserInfo();
        this.getTimesheetParams();
        this.addNewTimesheet();
        this.isLoading.next(false);
  }

  /**
   * @description : get timesheet list types
   */
getTimesheetParams(): void {
    this.route.params.subscribe(params => {
          this.typeTimesheet = params.type_timesheet;
          this.getAllTimesheet(this.nbtItems.getValue(), 0);
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

  /**
   * @description : get all timesheet of collaborator
   */
  getAllTimesheet(limit: number, offset: number): void {
      this.timesheetService.getTimesheetPaginator(
        `?application_id=${this.userService.applicationId}` +
        `&company_email=${this.companyEmail}` +
        `&email_address=${this.userService.emailAddress}` +
        `&type_timesheet=${this.typeTimesheet}` +
        `&status=ACTIVE&beginning=${offset}&number=${limit}`)
        .toPromise().then((res) => {
          if (res) {
            this.ELEMENT_DATA.next(res);
          }
      });
  }

  /**
   * @description Navigate to ADD NEW TIMESHEET Component
   */
  addNewTimesheet(): void {
    this.redirectUrl = '/collaborator/timesheet/add/' + this.typeTimesheet;
  }

  /**
   * @description : update timesheet
   * @param data: object
   */
  updateTimesheet(data) {
    if (data.timesheet_status === 'Pending') {
      const confirmation = {
        code: 'message',
        title: 'already submitted to the manager',
        description: 'Your timesheet is already submitted to the manager !'
      };
      this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '600px', '250px');
    } else if (data.timesheet_status === 'Approved') {
      const confirmation = {
        code: 'message',
        title: 'Approved Timesheet',
        description: 'Your timesheet is already approved by the manager !'
      };
      this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '600px', '250px');

    } else {
      this.router.navigate(
        ['/collaborator/timesheet/edit', this.typeTimesheet], {
          queryParams: {
            'id': btoa(data._id.toString())
          }
        });
    }
  }

  /**
   * @description : delete timesheet
   */
  deleteTimesheet(data): void {
    if (!!data && data.timesheet_status !== 'Pending') {
      const confirmation = this.modalData('delete', 'delete timesheet', 'Are you sure you want to delete these timeseets?');
      this.subscriptionDeleteModal = this.modalService.displayConfirmationModal(confirmation, '560px', '300px')
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (res) => {
            data.map(
              (row) => {
                if (res === true) {
                  if (row.timesheet_status === 'Draft') {
                    this.timesheetService.deleteTimesheet(row._id).toPromise()
                      .then((resp) => console.log(row._id, resp));
                  } else {
                    this.timesheetService.disableTimesheet(row._id).toPromise()
                      .then((resp) => console.log(row._id, resp));
                  }
                }
              });
            this.getAllTimesheet(this.nbtItems.getValue(), 0);
            this.subscriptionDeleteModal.unsubscribe();
          }
        );
    }
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    switch (rowAction.actionType.name) {
      case ('update'):
        this.updateTimesheet(rowAction.data);
        break;
      case ('delete'):
        this.deleteTimesheet(rowAction.data);
        break;
    }
  }
  sendColorObject(): any[] {
    return  [{
      columnCode: 'timesheet_status',
      condValue: [
        'Pending',
        'Rejected',
        'Approved',
        'Draft',
      ],
      color: [
        'warning-yellow font-semi-bold',
        'red font-semi-bold',
        'topaz font-semi-bold',
        'brownish-grey font-semi-bold',
      ],
    }];
  }

  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getAllTimesheet(params.limit, params.offset);
  }

  modalData(code: string, title: string, description: string): any {
    return { code, title, description};
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
