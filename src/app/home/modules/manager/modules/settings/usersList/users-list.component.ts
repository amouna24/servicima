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
  isLoading = new BehaviorSubject<boolean>(false);
  refData: { } = { };

  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private router: Router,
              private profileService: ProfileService,
              private userService: UserService,
              private utilsService: UtilsService,
              private modalService: ModalService, ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit() {
    this.isLoading.next(true);
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyId = userInfo['company'][0]['_id'];
          }
        });
    this.getAllUsers();
  }
  /**
   * @description : get all users
   */
  getAllUsers() {
    this.subscriptions.push(this.profileService.getAllUser(this.userService.emailAddress)
      .subscribe((res) => {
      this.ELEMENT_DATA.next(res);
        this.isLoading.next(false);
    }));
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
   * @param status: string
   */
  onChangeStatus(id: string) {
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      status: id['status']
    };

    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '560px', '300px').subscribe((value) => {
      if (value === true) {
        this.subscriptions.push( this.profileService.userChangeStatus(id['_id'], id['status'], this.userService.emailAddress).subscribe(
          async (res) => {
            if (res) {
             await this.getAllUsers();
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
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
