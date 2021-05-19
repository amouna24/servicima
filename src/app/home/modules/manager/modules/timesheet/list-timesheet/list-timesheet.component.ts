import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
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

import { ShowTimesheetComponent } from '../show-timesheet/show-timesheet.component';

@Component({
  selector: 'wid-list-timesheet',
  templateUrl: './list-timesheet.component.html',
  styleUrls: ['./list-timesheet.component.scss']
})
export class ListTimesheetComponent implements OnInit {

  ELEMENT_DATA = new BehaviorSubject<ITimesheetModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  companyEmail: string;
  subscriptions: Subscription;
  userInfo: IUserInfo;
  pending = 'Pending';
  rejected = 'Rejected';
  approved = 'Approved';
  refData: { } = { };
  collaboratorArray: IUserModel[] = [];
  categoryList: IViewParam[];

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
  ) { }

  async ngOnInit() {
    this.modalsServices.registerModals(
      { modalName: 'showTimesheet', modalComponent: ShowTimesheetComponent });
    this.isLoading.next(true);
    this.getUserInfo();
    this.getAllCollaborators();
    await this.getAllTimesheet();
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
          // console.log('user info:', data);
          this.companyEmail = data.user[0]['company_email'];
        }
      });
  }

  /**
   * @description : get all collaborators
   */
  getAllCollaborators() {
    this.profileService.getAllUser(this.companyEmail)
        .subscribe((res) => {
          this.collaboratorArray = res.filter(value => value.user_type === 'COLLABORATOR');
          // console.log('getAllCollaborators', this.collaboratorArray);
        });
  }

  async getRefdata() {
    const list = ['TIMESHEET_STATE', 'TIMESHEET_PROJECT_CATEGORY'];
    this.refData =  await this.refDataService
      .getRefData( this.utilService.getCompanyId(this.companyEmail, this.userService.applicationId) , this.userService.applicationId, list, false);
    return this.refData;
  }

  /**
   * @description : get all timesheet
   */
  async getAllTimesheet() {
    const data = await this.getRefdata();
    this.categoryList = data['TIMESHEET_PROJECT_CATEGORY'];
    this.timesheetService
      // tslint:disable-next-line:max-line-length
        .getTimesheet(`?application_id=${this.userService.applicationId}&company_email=${this.companyEmail}&timesheet_status=${this.pending}&timesheet_status=${ this.rejected }&timesheet_status=${this.approved}&inclusive=true`)
        .subscribe((res) => {
          res.map( (result) => {
            console.log('result', result);
            // tslint:disable-next-line:no-shadowed-variable
            this.collaboratorArray.forEach(async ( data) => {
              console.log('photo', data.photo);
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
                                       } });
                                     result['project_desc'] =  item[0].project_desc;
                                   });
            });
          });
        this.ELEMENT_DATA.next(res);
        this.isLoading.next(false);
      });
  }

  /**
   * @description : show timesheet
   * @param data: object
   */
  showUser(data: ITimesheetModel) {
    // console.log('data', data);
    this.modalsServices.displayModal('showTimesheet', data, '400px', '600px').subscribe((res) => {
      console.log('tt', res);
    });
  }

  /**
   * @description : update user
   * @param data: object
   */
  updateUser(data) {
    /*this.router.navigate(['/manager/settings/users/update-user'],
      { state: { id: data._id }
      });*/
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
      case ('show'): this.showUser(rowAction.data);
        break;
      case ('update'): this.updateUser(rowAction.data);
        break;
      case('delete'): this.onChangeStatus(rowAction.data);
    }
  }

}
