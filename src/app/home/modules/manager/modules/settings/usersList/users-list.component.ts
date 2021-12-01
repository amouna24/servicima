import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UtilsService } from '@core/services/utils/utils.service';

import { IUserModel } from '@shared/models/user.model';
@Component({
  selector: 'wid-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  ELEMENT_DATA = new BehaviorSubject<IUserModel[]>([]);
  companyId: string;
  emailAddress: string;
  isLoading = new BehaviorSubject<boolean>(false);
  refData: { } = { };
  typeUser: string;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];

  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);

  constructor(private router: Router,
              private profileService: ProfileService,
              private userService: UserService,
              private utilsService: UtilsService,
              private modalService: ModalService, ) {
    this.typeUser = this.router.getCurrentNavigation().extras.state?.typeUser;
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit() {
    this.isLoading.next(true);
    this.getConnectedUser();
    this.getAllUsers(this.nbtItems.getValue(), 0);
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyId = userInfo['company'][0]['_id'];
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  getDataWithStatus(status) {
  }

  /**
   * @description : get all users
   */
  getAllUsers(limit, offset) {
    this.subscriptions.push(
      this.profileService.getAllUser(this.emailAddress, '', limit, offset)
        .subscribe((res) => {
          res['results'] = this.getUserWithType(res['results'], this.typeUser);
        this.ELEMENT_DATA.next(res['results']);
        this.isLoading.next(false);
    }));
  }

  /**
   * @description : Filter user with type
   * @param list: all list users
   * @param type: type user(candidate, collaborator, staff)
   */
  getUserWithType(list: IUserModel[], type: string) {
    switch (type) {
      case 'candidate': return list.filter(listUser => listUser.user_type === 'CANDIDATE');
      case 'staff': return list.filter(listUser => listUser.user_type === 'STAFF');
      case 'collaborator': return list.filter(listUser => listUser.user_type === 'COLLABORATOR');
      case '':
      case undefined:
      return list;
    }
  }
  /**
   * @description : show user
   * @param data: object
   */
  showUser(data) {
    this.router.navigate(['/manager/settings/users/show-user'],
      { state: { id: data._id }
      });
  }

  /**
   * @description : update user
   * @param data: object
   */
  updateUser(data) {
    this.router.navigate(['/manager/settings/users/update-user'],
      { state: { id: data._id }
      });
  }

  /**
   * @description : change the status of the user
   * @param id: string
   * @params status: string
   */
  onChangeStatus(id: string) {
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      status: id['status']
    };

    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '560px', '300px').subscribe((value) => {
      if (value === true) {
        this.subscriptions.push( this.profileService.userChangeStatus(id['_id'], id['status'], this.emailAddress).subscribe(
          async (res) => {
            if (res) {
             await this.getAllUsers(this.nbtItems.getValue(), 0);
            }
          },
          (err) => console.error(err),
        ));
        this.subscriptionModal.unsubscribe();
      }
    });
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

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getAllUsers(params.limit, params.offset);
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
