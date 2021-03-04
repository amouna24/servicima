import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';

import { UtilsService } from '@core/services/utils/utils.service';
import { IUserModel } from '@shared/models/user.model';
import { ICredentialsModel } from '@shared/models/credentials.model';
import { IViewParam } from '@shared/models/view.model';
@Component({
  selector: 'wid-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  loaded: Promise<boolean>;
  ELEMENT_DATA = [];
  usersList: IUserModel[] = [];
  code: string;
  companyId: string;
  credentials: ICredentialsModel;
  refData: { } = { };

  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private router: Router,
     private profileService: ProfileService,
     private userService: UserService,
     private utilsService: UtilsService,
     private modalService: ModalService,
     private appInitializerService: AppInitializerService,
     private localStorageService: LocalStorageService) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.credentials = this.localStorageService.getItem('userCredentials');
      this.getAllUsers();
  }
  /**
   * @description : get all users
   */
  getAllUsers(): void {
    this.profileService.getAllUser(this.credentials['email_address']).subscribe(async (res) => {
      this.ELEMENT_DATA = res;
      this.ELEMENT_DATA.forEach((data) => {
        this.getRefdata();
        data['gender_id']  = this.utilsService.getViewValue(data['gender_id'], this.refData['GENDER']);
        data['user_type'] =  this.refData['PROFILE_TYPE'].find((type: IViewParam) =>
          type.value ===  data['user_type']).viewValue;
      });
      this.loaded = Promise.resolve(true);
    });
  }
  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  getRefdata(): void {
    const list = [ 'PROF_TITLES', 'PROFILE_TYPE', 'GENDER'];
    this.refData = this.utilsService.getRefData(this.companyId, this.credentials['application_id'],
     list);
  }
  /*  à effacer */
  updateOrDelete(id: string) {
    this.router.navigate(['/manager/user/edit-profile'],
      {
        queryParams: {
          'id': id
        }
      });
  }
/*  à effacer */
  showRowData(id: string) {
    this.router.navigate(['/manager/user/profile'],
      {
        queryParams: {
          'id': id['_id']
        }
      });
  }

  /**
   * @description : show user
   * @param data: object
   */
  showUser(data) {
    this.router.navigate(['/manager/user/profile'],
      {
        queryParams: {
          'id': data['_id']
        }
      });
  }

  /**
   * @description : update user
   * @param data: object
   */
  updateUser(data) {
    this.router.navigate(['/manager/user/edit-profile'],
      {
        queryParams: {
          'id': data._id
        }
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
        this.subscriptions.push( this.profileService.userChangeStatus(id['_id'], id['status'], this.credentials['email_address']).subscribe(
          (res) => {
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
/*  switchAction(rowAction: any) {
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
