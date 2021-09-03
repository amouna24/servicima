import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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

import { ShowTimesheetComponent } from '../show-timesheet/show-timesheet.component';
import { RejectTimesheetComponent } from '../reject-timesheet/reject-timesheet.component';

@Component({
  selector: 'wid-list-timesheet',
  templateUrl: './list-timesheet.component.html',
  styleUrls: ['./list-timesheet.component.scss']
})
export class ListTimesheetComponent implements OnInit, OnDestroy {
  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  companyEmail: string;
  title_id: string;
  subscriptions: Subscription;
  userInfo: IUserInfo;
  refData: { } = { };
  listStatus: string;
  refdata: any;

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
  ) { }

  async ngOnInit() {
    this.getUserInfo();
    this.refdata =  await this.getRefdata();
    this.modalsServices.registerModals({ modalName: 'showTimesheet', modalComponent: ShowTimesheetComponent });
    this.modalsServices.registerModals({ modalName: 'rejectTimesheet', modalComponent: RejectTimesheetComponent });
    this.isLoading.next(true);
    this.route.params.subscribe(params => {
      this.listStatus = params['status'];
      this.getAllTimesheet();
    });
  }

  /**
   * @description back click
   */
  backClicked() {
    this.location.back();
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
   * @description : get ref data
   */
  async getRefdata() {
    const list = ['TIMESHEET_STATE', 'TIMESHEET_PROJECT_CATEGORY', 'PROF_TITLES'];
    this.refData =  await this.refDataService
        .getRefData(this.utilService.getCompanyId(this.companyEmail, this.userService.applicationId) , this.userService.applicationId, list, false);

    return this.refData;
  }

  /**
   * @description : get all timesheet
   */
getAllTimesheet() {
  this.timesheetService.getTimesheet(
          `?application_id=${this.userService.applicationId}` +
          `&company_email=${this.companyEmail}` +
          `&timesheet_status=${this.listStatus}`).toPromise().then(
         async (timesheetList) => {
            await timesheetList.forEach(
             (timsheet) => {
                this.profileService.getUser(`?email_address=${timsheet.TimeSheetKey.email_address}`)
                  .toPromise().then(
                  (profile) => {
                    console.log(profile.results[0]);
                    timsheet['first_name'] = profile.results[0].first_name;
                    timsheet['last_name'] = profile.results[0].last_name;
                    timsheet['profile'] = `${profile.results[0].first_name} ${profile.results[0].last_name}`;
                    timsheet['photo'] = profile.results[0].photo;
                  }
                );
                this.contractService.getContractProject(`?project_code=${timsheet.TimeSheetKey.project_code}`).toPromise().then(
                  (project) => timsheet['project_desc'] = project[0].project_desc
                );
              });
           this.ELEMENT_DATA.next(timesheetList);
           this.isLoading.next(false);
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
              this.modalsServices.displayModal(
                'rejectTimesheet',
                { timesheet: data, action: res},
                '607px',
                '350px')
                  .subscribe((result) => {
                    if (result) {
                      this.getAllTimesheet();
                    }
                  });
              },
    error => {
          console.log(error);
        }
      );
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): this.showTimesheet(rowAction.data);
        break;
      case ('update'):
        break;
      case('delete'):
        break;
    }
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
