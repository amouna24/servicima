import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UploadService } from '@core/services/upload/upload.service';
import { SocialNetwork } from '@core/services/utils/social-network';
import { UtilsService } from '@core/services/utils/utils.service';

import { IViewParam } from '@shared/models/view.model';
import { IUserModel } from '@shared/models/user.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { INetworkSocial } from '@shared/models/social-network.model';

import { ModalSocialWebsiteComponent } from '@shared/components/modal-social-website/modal-social-website.component';

@Component({
  selector: 'wid-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user: IUserModel;
  companyId: string;
  companyName: string;
  userRole: string;
  applicationId: string;
  emailAddress: string;
  languages: IViewParam[] = [];
  avatar: any;
  gender: string;
  langDesc: string;
  title: string;
  icon: string;
  id: string;
  isLoading: boolean;
  leftList: INetworkSocial[];
  rightList: INetworkSocial[];
  refData: { } = { };
  showList: INetworkSocial[] = [];
  /** subscription */
  private subscriptions: Subscription[] = [];

  constructor(private utilsService: UtilsService,
    private appInitializerService: AppInitializerService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
    private socialNetwork: SocialNetwork,
    private router: Router,
    private profileService: ProfileService
  ) {
  }

  /**
   * @description: Loaded when component in init state
   */
  ngOnInit(): void {
    this.getConnectedUser();
  }
  /**
   * @description: get connected user
   */
  getConnectedUser(): void {
    this.isLoading = true;
    this.applicationId = this.localStorageService.getItem('userCredentials')['application_id'];
    this.modalService.registerModals(
      { modalName: 'AddLink', modalComponent: ModalSocialWebsiteComponent });
    this.subscriptions.push(this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.checkComponentAction(data);
      }
    }));
  }
  /**
   * @description: check if the user is in his home profile
   * or the manager wants to add a new profile
   * or he wants to update the profile of one user
   */
  checkComponentAction(connectedUser: IUserInfo) {
    /***************** go id from route *****************
     *******************************************************/
    this.route.queryParams.subscribe(params => {
      this.id = params.id || null;
    });
    /***************** administrator show another user *****************
     *******************************************************************/
    if (this.id) {
      this.profileService.getUserById(this.id).subscribe(async user => {
        this.user = user[0];
        this.avatar = await this.uploadService.getImage(user[0]['photo']);
        this.emailAddress = this.user['userKey']['email_address'];
        this.getRefData();
        this.getIcon();
        this.userService.getUserRole(this.applicationId, this.emailAddress).subscribe(
          (data) => {
            this.userRole = this.utilsService.getViewValue(data[0]['userRolesKey']['role_code'], this.refData ['ROLE']);
            this.isLoading = false;
          });
        this.getListNetworkSocial(this.user, 'user');
      });
      /***************** current user show your profile *****************
       *******************************************************************/
    } else {
      this.userService.avatar$.subscribe(
        avatar => {
          this.avatar = avatar;
        }
      );
      this.userRole = connectedUser['userroles'][0]['userRolesKey']['role_code'];
      this.applicationId = connectedUser['user'][0]['userKey'].application_id;
      this.emailAddress = connectedUser['user'][0]['userKey'].email_address;
      this.user = connectedUser['user'][0];
      this.getRefData();
      this.getIcon();
      this.isLoading = false;
    }
      this.getListNetworkSocial(this.user, 'user');
  }

  /**
   * @description: get the refData from appInitializer service and mapping data
   */
  getRefData(): void {
    this.getLanguages();
    const list = ['GENDER', 'PROF_TITLES', 'PROFILE_TYPE', 'ROLE'];
     this.refData = this.utilsService.getRefData(this.companyId, this.applicationId, list);
    this.gender = this.utilsService.getViewValue(this.user['gender_id'], this.refData ['GENDER']);
    this.langDesc = this.utilsService.getViewValue(this.user['language_id'], this.languages);
    this.title = this.utilsService.getViewValue(this.user['title_id'], this.refData ['PROF_TITLES']);
  }

  /**
   * @description: get languages
   */
  getLanguages(): void {
    this.languages = this.appInitializerService.languageList.map((language) => {
      return ({ value: language._id, viewValue: language.language_desc });
    });
  }

  /**
   * @description: Update
   */
  update(): void {
    /***************** go to update profile page *****************
     *******************************************************************/
    if (this.id) {
      this.router.navigate(['/manager/user/edit-profile'],
        {
          queryParams: {
            'id': this.id
          }
        });
    } else {
      this.router.navigate(['/manager/user/edit-profile']);
    }
  }

  /**
   * @description: Get icon
   */
  getIcon(): void {
    if (this.user['gender_id'] === 'M') {
      this.icon = 'wi_male';
    } else {
      this.icon = 'wi_female';
    }
  }

  /**
   * @description: Add link
   */
  addLink(): void {
    this.modalService.displayModal('AddLink', this.user, '620px', '535px').subscribe((user) => {
      if (user) {
        this.socialNetwork.updateNetworkSocial(this.user, user);
        this.getListNetworkSocial(this.user, 'user');
      }
    });
  }

  /**
   * @description: show network social
   */
  getListNetworkSocial(value, placeholder) {
    const list = this.socialNetwork.getListNetwork(value, placeholder);
    this.leftList = [];
    this.rightList = [];
    this.socialNetwork.getList(list, this.leftList, this.rightList);
    this.showList = [ ...this.leftList, ...this.rightList];
    this.showList = this.showList.filter((item) => {
      if (item.value !==  'link' ) {
      return item;
      }
    });
  }

  /**
   * @description: destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
