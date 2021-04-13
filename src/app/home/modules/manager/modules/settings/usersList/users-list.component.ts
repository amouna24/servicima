import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { RefdataService } from '@core/services/refdata/refdata.service';

import { ICredentialsModel } from '@shared/models/credentials.model';
import { IViewParam } from '@shared/models/view.model';
import { IUserModel } from '@shared/models/user.model';
@Component({
  selector: 'wid-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  ELEMENT_DATA = new BehaviorSubject<IUserModel[]>([]);
  companyId: string;
  credentials: ICredentialsModel;
  isLoading = new BehaviorSubject<boolean>(false);
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
              private localStorageService: LocalStorageService,
              private refdataService: RefdataService, ) { }

  /**
   * @description Loaded when component in init state
   */
 async ngOnInit() {
    this.credentials = this.localStorageService.getItem('userCredentials');
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyId = userInfo['company'][0]['_id'];
          }
        });
   await this.getAllUsers();
  }
  /**
   * @description : get all users
   */
 async getAllUsers() {
    await this.getRefdata();
    this.isLoading.next(true);
    this.subscriptions.push(this.profileService.getAllUser(this.credentials['email_address'])
      .subscribe((res) => {
      res.forEach( (data) => {
        data['gender_id']  = this.utilsService.getViewValue(data['gender_id'], this.refData['GENDER']);
       if (data['user_type']) {
        data['user_type'] =  this.refData['PROFILE_TYPE'].find((type: IViewParam) =>
          type.value ===  data['user_type']).viewValue;
       }
      });
      this.ELEMENT_DATA.next(res);
      this.isLoading.next(false);
    }));
  }
  /**
   * @description : get the refData from appInitializer service and mapping data
   */
 async getRefdata() {
    const list = [ 'PROF_TITLES', 'PROFILE_TYPE', 'GENDER', 'ROLE'];
    this.refData = await this.refdataService.getRefData( this.companyId , this.credentials['application_id'],
     list);
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
