import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UploadService } from '@core/services/upload/upload.service';

import { IViewParam } from '@shared/models/view.model';
import { UtilsService } from '@core/services/utils/utils.service';
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
  leftList: INetworkSocial[];
  rightList: INetworkSocial[];
  refData: { } = { };
  /** subscription */
  private subscriptions: Subscription[] = [];

  constructor(private utilsService: UtilsService,
    private appInitializerService: AppInitializerService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
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
          });
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
    }
      this.getListNetworkSocial();
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
        this.user['youtube_url'] = user['youtube_url'];
        this.user['linkedin_url'] = user['linkedin_url'];
        this.user['twitter_url'] = user['twitter_url'];
        this.user['facebook_url'] = user['facebook_url'];
        this.user['instagram_url'] = user['instagram_url'];
        this.user['whatsapp_url'] = user['whatsapp_url'];
        this.user['viber_url'] = user['viber_url'];
        this.user['skype_url'] = user['skype_url'];
        this.user['other_url'] = user['other_url'];
        this.getListNetworkSocial();
      }
    });
  }

  /**
   * @description: show network social
   */
  getListNetworkSocial() {
    this.leftList = [];
    this.rightList = [];
    const list = [
      { placeholder: 'user.linkedinacc', value: this.user?.linkedin_url},
      { placeholder: 'user.whatsappacc', value: this.user?.whatsapp_url },
      { placeholder: 'user.facebookacc', value: this.user?.facebook_url },
      { placeholder: 'user.skypeacc', value: this.user?.skype_url },
      { placeholder: 'user.otheracc', value: this.user?.other_url},
      { placeholder: 'user.instagramacc', value: this.user?.instagram_url},
      { placeholder: 'user.twitteracc', value: this.user?.twitter_url},
      { placeholder: 'user.youtubeacc', value: this.user?.youtube_url},
      { placeholder: 'user.viberacc', value: this.user?.viber_url},
      { placeholder: 'company.addlink', value: 'link'},
    ];
     this.utilsService.getList(list, this.leftList, this.rightList);
  }
  /**
   * @description: destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

  getI() {

  }

}
