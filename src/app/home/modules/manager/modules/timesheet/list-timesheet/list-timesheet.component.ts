import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { takeUntil } from 'rxjs/operators';

import { ShowTimesheetComponent } from '../show-timesheet/show-timesheet.component';
import { RejectTimesheetComponent } from '../reject-timesheet/reject-timesheet.component';

@Component({
  selector: 'wid-list-timesheet',
  templateUrl: './list-timesheet.component.html',
  styleUrls: ['./list-timesheet.component.scss']
})
export class ListTimesheetComponent implements OnInit, OnDestroy {
  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(true);
  companyEmail: string;
  title_id: string;
  subscriptions: Subscription;
  userInfo: IUserInfo;
  refData: { } = { };
  listStatus: string;
  subscriptionDeleteModal: Subscription;
  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);
  offset = new BehaviorSubject<number>(0);
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private location: Location,
    private timesheetService: TimesheetService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private refDataService: RefdataService,
    private utilService: UtilsService,
    private modalsServices: ModalService,
    private route: ActivatedRoute,
    private contractService: ContractsService
  ) {
  }

  async ngOnInit() {
    this.getUserInfo();
    this.modalsServices.registerModals({ modalName: 'showTimesheet', modalComponent: ShowTimesheetComponent});
    this.modalsServices.registerModals({ modalName: 'rejectTimesheet', modalComponent: RejectTimesheetComponent});
    this.route.params.subscribe(params => {
      this.listStatus = params['status'];
      this.getAllTimesheet(this.nbtItems.getValue(), this.offset.getValue());
    });
    this.isLoading.next(false);
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
   * @description : get all timesheet
   */
  getAllTimesheet(limit: number, offset: number) {
    this.timesheetService.getTimesheetPaginator(
      `?application_id=${this.userService.applicationId}` +
      `&company_email=${this.companyEmail}` +
      `&timesheet_status=${this.listStatus}` +
      `&status=ACTIVE&beginning=${offset}&number=${limit}`).toPromise().then(
      async (timesheetList) => {
        if (timesheetList) {
          timesheetList['results'].map((timesheet) => {
            this.profileService.getUser(`?email_address=${timesheet.TimeSheetKey.email_address}`)
              .toPromise().then(
              (profile) => {
                timesheet['first_name'] = profile.results[0].first_name;
                timesheet['last_name'] = profile.results[0].last_name;
                timesheet['profile'] = `${profile.results[0].first_name} ${profile.results[0].last_name}`;
                timesheet['photo'] = profile.results[0].photo;
                timesheet['user_position'] = profile.results[0].title_id;
              }
            );
            this.contractService.getContractProject(`?project_code=${timesheet.TimeSheetKey.project_code}`).toPromise().then(
              (project) => timesheet['project_desc'] = project['results'][0].project_desc
            );
          });
          this.ELEMENT_DATA.next(timesheetList);
        }
      });
  }

  /**
   * @description : show timesheet
   * @param data: object
   */
  showTimesheet(data: ITimesheetModel) {
    this.modalsServices.displayModal('showTimesheet', data, '400px', '600px')
      .subscribe(
        (res) => {
          if (res) {
            this.modalsServices.displayModal(
              'rejectTimesheet',
              { timesheet: data, action: res},
              '607px',
              '353px')
              .subscribe((result) => {
                if (result) {
                  this.getAllTimesheet(this.nbtItems.getValue(), 0);
                }
              });
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  deleteTimesheet(data: any[]) {
    if (!!data) {
      const confirmation = {
        code: 'delete',
        title: 'delete timesheet',
        description: `Are you sure you want to delete these ${data.length} timesheet?`
      };
      this.subscriptionDeleteModal = this.modalsServices
        .displayConfirmationModal(confirmation, '560px', '300px')
        .pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          (res) => {
            data.map(
              async (row) => {
                if (res === true) {
                  await this.timesheetService.disableTimesheet(row._id);
                }
              });
            this.getAllTimesheet(this.nbtItems.getValue(), this.offset.getValue());
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
        this.showTimesheet(rowAction.data);
        break;
      case ('Delete'):
        this.deleteTimesheet(rowAction.data);
        break;
    }
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.offset.next(params.offset);
    this.getAllTimesheet(params.limit, params.offset);
  }

  /**
   * @description back click
   */
  backClicked() {
    this.location.back();
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
