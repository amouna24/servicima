import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { UserService } from '@core/services/user/user.service';
import { IUserModel } from '@shared/models/user.model';
import { ProfileService } from '@core/services/profile/profile.service';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IViewParam } from '@shared/models/view.model';
import { ModalService } from '@core/services/modal/modal.service';
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
  isLoading = new BehaviorSubject<boolean>(false);
  companyEmail: string;
  title_id: string;
  job_title: string;
  subscriptions: Subscription;
  userInfo: IUserInfo;
  pending = 'Pending';
  rejected = 'Rejected';
  approved = 'Approved';
  refData: { } = { };
  collaboratorArray: IUserModel[] = [];
  categoryList: IViewParam[];
  searchCriteria: string;
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
  ) { }

  async ngOnInit() {
    this.getUserInfo();
   this.refdata =  await this.getRefdata();
    this.modalsServices.registerModals(
      { modalName: 'showTimesheet', modalComponent: ShowTimesheetComponent });
    this.modalsServices.registerModals(
      { modalName: 'rejectTimesheet', modalComponent: RejectTimesheetComponent });
    this.isLoading.next(true);
    this.getAllCollaborators();
    await this.getAllTimesheet();
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(params => {
        if (!!params.timesheet_status) {
          this.searchCriteria = params.timesheet_status;
          this.getAllTimesheet();
        } else {
          this.searchCriteria = '';
          this.getAllTimesheet();
        }
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
          /*this.title_id = data.user[0]['title_id'];
          console.log('title id', this.title_id);
          console.log('refData', this.refDataService.refData['PROF_TITLES']);
          // this.job_title = this.utilService.getViewValue(this.title_id, this.refDataService.refData['PROF_TITLES']);
          console.log('job', this.job_title);*/
        }
      });
  }

  /**
   * @description : get all collaborators
   */
  getAllCollaborators() {
    this.profileService
        .getAllUser(this.companyEmail)
        .subscribe((res) => {
          this.collaboratorArray = res.filter(value => value.user_type === 'COLLABORATOR');
        });
  }

  /**
   * @description : get ref data
   */
  async getRefdata() {
    const list = ['TIMESHEET_STATE', 'TIMESHEET_PROJECT_CATEGORY', 'PROF_TITLES'];
    this.refData =  await this.refDataService
        .getRefData(this.utilService.getCompanyId(this.companyEmail, this.userService.applicationId) , this.userService.applicationId, list, false);

    console.log('refdata', this.refData);
    return this.refData;
  }

  /**
   * @description : get all timesheet
   */
  async getAllTimesheet() {
    this.categoryList = this.refdata['TIMESHEET_PROJECT_CATEGORY'];
    this.timesheetService
        .getTimesheet(
          `?application_id=${this.userService.applicationId}&company_email=${this.companyEmail}&timesheet_status=${this.searchCriteria}`
        )
        .subscribe((res) => {
          if (res['msg_code'] !== '0004') {
          res.map( (result) => {
            // tslint:disable-next-line:no-shadowed-variable
            this.collaboratorArray.forEach(async ( data) => {
              result['profile'] = data.first_name + ' ' + data.last_name;
              result['first_name'] = data.first_name;
              result['last_name'] = data.last_name;
              result['user_position'] = data.user_type;
              result['photo'] = data.photo;
              this.timesheetService.getTimesheetProject(`?project_code=${result.TimeSheetKey.project_code}`)
                                   .subscribe(async (item) => {
                                     this.categoryList.forEach(
                                       (category) => {
                                         if (category.value === item[0].category_code) {
                                           result['category'] = category.viewValue;
                                         }
                                       });
                                     result['project_desc'] =  item[0].project_desc;
                                   });
            });
          });
        this.ELEMENT_DATA.next(res);
        this.isLoading.next(false);
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
          if (res === 'reject') {
            this.modalsServices.displayModal('rejectTimesheet', data, '600px', '350px')
                .subscribe((result) => {
                  if (result === 'reject') {
                    this.getAllTimesheet();
                  }
                });

          } else if (res === 'approve') {
            this.modalsServices.displayModal('rejectTimesheet', { timesheet: data , value: 'Approved' }, '600px', '350px')
                .subscribe((result) => {
                  if (result === 'approve') {
                    this.getAllTimesheet();
                  }
                });
          }},
    error => {
          console.log(error);
        }
      );
  }

  /**
   * @description : update user
   * @param data: object
   */
  updateTimesheet(data) {
  }

  /**
   * @description : change the status of the user
   * @param id: string
   * @param status: string
   */
  onChangeStatus(id: string) {
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      status: id['status']
    };
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): this.showTimesheet(rowAction.data);
        break;
      case ('update'): this.updateTimesheet(rowAction.data);
        break;
      case('delete'): this.onChangeStatus(rowAction.data);
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
