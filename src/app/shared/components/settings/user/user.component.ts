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
  path: string;
  avatar: any;
  gender: string;
  lang: string;
  title: string;
  icon: string;
  id: string;
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
        this.getRefdata();
        this.getIcon();
        this.userService.getUserRole(this.applicationId, this.emailAddress).subscribe(
          (data) => {
            const list = ['ROLE'];
            const refData = this.utilsService.getRefData(this.companyId, this.applicationId,
              list);
            this.userRole = this.utilsService.getViewValue(data[0]['userRolesKey']['role_code'], refData['ROLE']);
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
      this.getRefdata();
      this.getIcon();
    }

  }

  /**
   * @description: get the refData from appInitializer service and mapping data
   */
  getRefdata(): void {
    this.getLanguages();
    const list = ['GENDER', 'PROF_TITLES', 'PROFILE_TYPE', 'ROLE'];
    const refData = this.utilsService.getRefData(this.companyId, this.applicationId, list);
    this.gender = this.utilsService.getViewValue(this.user['gender_id'], refData['GENDER']);
    this.lang = this.utilsService.getViewValue(this.user['language_id'], this.languages);
    this.title = this.utilsService.getViewValue(this.user['title_id'], refData['PROF_TITLES']);
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
    /***************** go to page update profile *****************
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
    this.modalService.displayModal('AddLink', this.user, '50%', '80%');
  }

  /**
   * @description: destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
