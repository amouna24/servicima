import { Component, OnInit } from '@angular/core';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ModalService } from '@core/services/modal/modal.service';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

const TIMESHEET_EXTRA = 'TIMESHEET_EXTRA';
const TIMESHEET = 'TIMESHEET';

@Component({
  selector: 'wid-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss']
})

export class TimesheetsListComponent implements OnInit {

  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);

  isLoading = new BehaviorSubject<boolean>(false);
  companyEmail: string;
  subscriptions: Subscription;
  userInfo: IUserInfo;
  redirectUrl: string;
  addButtonLabel: string;
  flag: boolean;
  typeTimesheet: string;
  subscriptionModal: Subject<boolean>;

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
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
    this.isLoading.next(true);
  }

  /**
   * @description : get timesheet list types
   */
getTimesheetParams(): void {
    this.route.params.subscribe(params => {
          this.typeTimesheet = params.type_timesheet;
          this.getAllTimesheet();
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
  getAllTimesheet() {
      this.timesheetService.getTimesheet(
        `?application_id=${this.userService.applicationId}` +
        `&email_address=${this.userService.emailAddress}` +
        `&company_email=${this.companyEmail}` +
        `&type_timesheet=${this.typeTimesheet}`)
        .subscribe((res) => {
          if (!!res) {
            this.ELEMENT_DATA.next(res);
          } else {
            this.ELEMENT_DATA.next([]);
          }
          this.isLoading.next(false);
        });
  }

  /**
   * @description Navigate to ADD NEW TIMESHEET Component
   */
  addNewTimesheet() {
    this.redirectUrl = '/collaborator/timesheet/add/' + this.typeTimesheet;
    this.addButtonLabel = 'New';
  }

  /**
   * @description : show timesheet
   * @param data: object
   */
  showTimesheet(data: ITimesheetModel) { }

  /**
   * @description : update timesheet
   * @param data: object
   */
  updateTimesheet(data) {
      this.router.navigate(
        ['/collaborator/timesheet/edit', this.typeTimesheet], {
          queryParams: {
            'id': data._id.toString()
          }
        });
  }

  /**
   * @description : change the status of the timesheet
   * @param id: string
   * @param status: string
   */
  onChangeStatus(id: string) {
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      status: id['status']
    };

    /*this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '560px', '300px').subscribe((value) => {
      if (value === true) {
        this.subscriptions.push( this.profileService.userChangeStatus(id['_id'], id['status'], this.emailAddress).subscribe(
          async (res) => {
            if (res) {
              await this.getAllUsers();
            }
          },
          (err) => console.error(err),
        ));
        this.subscriptionModal.unsubscribe();
      }
    });*/
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'):
        this.showTimesheet(rowAction.data);
        break;
      case ('update'):
        if (rowAction.data.timesheet_status === 'Pending') {
          const confirmation = {
            code: 'message',
            title: 'already submitted to the manager',
            description: 'Your timesheet is already submitted to the manager !'
          };
          this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '600px', '250px');
          break;
        } else if (rowAction.data.timesheet_status === 'Approved') {
          const confirmation = {
            code: 'message',
            title: 'Approved Timesheet',
            description: 'Your timesheet is already approved by the manager !'
          };
          this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '600px', '250px');
          break;
        }
        this.updateTimesheet(rowAction.data);
        break;
      case('delete'): this.onChangeStatus(rowAction.data);
    }
  }

}
