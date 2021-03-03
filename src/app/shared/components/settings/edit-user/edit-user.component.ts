import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';

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
import { userType } from '@shared/models/userProfileType.model';
import { Location } from '@angular/common';

import { ChangePwdComponent } from '../changepwd/changepwd.component';
@Component({
  selector: 'wid-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  languages: IViewParam[] = [];
  user: IUserModel;
  companyId: string;
  companyName: string;
  infoUser: IUserInfo;
  userRole: string;
  userRoleId: string;
  form: FormGroup;
  applicationId: string;
  emailAddress: string;
  showCompany: boolean;
  titleList: IViewParam[];
  genderList: IViewParam[];
  typeList: IViewParam[];
  roleList: IViewParam[];
  avatar: any;
  haveImage: any;
  title: string;
  photo: FormData;
  userInfo: IUserModel;
  idRole: string;
  emailAddressStorage: string;
  id: string;
  profileUserType = userType.UT_USER;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(private utilsService: UtilsService,
    private profileService: ProfileService,
    private appInitializerService: AppInitializerService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  /** list filtered by search keyword */
  public filteredLanguage = new ReplaySubject(1);
  public filteredGender = new ReplaySubject(1);
  public filteredTitle = new ReplaySubject(1);
  public filteredRole = new ReplaySubject(1);

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.initForm();
    this.getConnectedUser();
  }

  /**
   * @description: get connected user
   */
  getConnectedUser(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials')['application_id'];
    this.emailAddressStorage = this.localStorageService.getItem('userCredentials')['email_address'];
    this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.infoUser = data;
        this.user = data['user'][0];
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.checkComponentAction(data);
      }
    });
    this.modalService.registerModals(
      { modalName: 'changePassword', modalComponent: ChangePwdComponent });
  }
  /**
   * @description : check if the user is in his home profile
   * or the manager wants to add a new profile
   * or he wants to update the profile of one user
   */
  checkComponentAction(connectedUser: IUserInfo) {
    this.avatar = null;
    this.photo = null;
    this.route.queryParams.subscribe(params => {
      this.id = params.id || null;
    });

    /***************** go to page Add user *****************
     *******************************************************/
    if (this.router.url === '/manager/settings/users/add-user') {
      this.title = 'Add';
      this.showCompany = false;
      this.form.controls['homeCompany'].setValue(this.companyName);
      /***************** go to page Update user by id *****************
       ****************************************************************/
    } else if (this.id) {
      this.title = 'Update';
      this.showCompany = true;
      this.profileService.getUserById(this.id).subscribe(async user => {
        this.userInfo = user[0];
        this.haveImage = user[0]['photo'];
        this.avatar = await this.uploadService.getImage(user[0]['photo']);
        this.emailAddress = user[0]['userKey'].email_address;
        this.userService.getUserRole(this.applicationId, this.emailAddress).subscribe(
          (data) => {
            this.idRole = data[0]['_id'];
            this.userRole = data[0]['userRolesKey']['role_code'];
            this.form.controls['userType'].disable();
            this.form.controls['homeCompany'].disable();
            this.setForm();
          });
      });
      /***************** go to page Update profile user *****************
       ****************************************************************/
    } else {
      this.title = 'Update';
      this.userService.avatar$.subscribe(
        avatar => {
          this.avatar = avatar;
        }
      );
      this.haveImage = connectedUser['user'][0]['photo'];
      this.userRole = connectedUser['userroles'][0]['userRolesKey']['role_code'];
      this.showCompany = true;
      this.userInfo = connectedUser['user'][0];
      this.emailAddress = connectedUser['user'][0]['userKey'].email_address;
      this.setForm();
      this.form.controls['userType'].disable();
      this.form.controls['homeCompany'].disable();
      this.form.controls['roleCtrl'].disable();
    }
    this.getRefdata();
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      emailAddress: [''],
      companyEmail: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      profPhone: [''],
      cellphoneNbr: [''],
      userType: ['', [Validators.required]],
      twitterAccount: [''],
      genderProfil: ['', [Validators.required]],
      youtubeAccount: [''],
      linkedinAccount: [''],
      homeCompany: [{ value: '', disabled: true }],
      roleCtrl: [''],
      titleCtrl: [''],
      languageCtrl: [''],
      titleFilterCtrl: [''],
      languageFilterCtrl: [''],
      roleFilterCtrl: [''],
    });
  }

  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.setValue({
      emailAddress: this.userInfo['userKey'].email_address,
      companyEmail: this.userInfo['company_email'],
      firstName: this.userInfo['first_name'],
      lastName: this.userInfo['last_name'],
      profPhone: this.userInfo['prof_phone'],
      cellphoneNbr: this.userInfo['cellphone_nbr'],
      userType: this.userInfo['user_type'],
      twitterAccount: this.userInfo['twitter_url'],
      youtubeAccount: this.userInfo?.youtube_url ? this.userInfo?.youtube_url : 'none' ,
      linkedinAccount: this.userInfo['linkedin_url'],
      homeCompany: this.companyName,
      genderProfil: this.userInfo['gender_id'],
      roleCtrl: this.userRole,
      languageCtrl: this.userInfo['language_id'] ? this.userInfo['language_id'] : '',
      titleCtrl: this.userInfo['title_id'],
      titleFilterCtrl: '',
      languageFilterCtrl: '',
      roleFilterCtrl: '',
    });
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  getRefdata(): void {
    const list = ['GENDER', 'PROF_TITLES', 'PROFILE_TYPE', 'ROLE'];
    const refData = this.utilsService.getRefData(this.companyId, this.applicationId,
      list);
    this.titleList = refData['PROF_TITLES'];
    this.genderList = refData['GENDER'];
    this.typeList = refData['PROFILE_TYPE'];
    this.roleList = refData['ROLE'];
    this.getLanguages();
    this.filteredTitle.next(this.titleList.slice());
    this.filteredLanguage.next(this.languages.slice());
    this.filteredRole.next(this.roleList.slice());
    this.utilsService.changeValueField(this.titleList, this.form.controls.titleFilterCtrl, this.filteredTitle);
    this.utilsService.changeValueField(this.languages, this.form.controls.languageFilterCtrl, this.filteredLanguage);
    this.utilsService.changeValueField(this.roleList, this.form.controls.roleFilterCtrl, this.filteredRole);
  }

  /**
   * @description  : Open dialog change password
   */
  onChangePassword(): void {
    this.modalService.displayModal('changePassword', null, '570px', '520px');
  }

  /**
   * @description : update the user info
   * or add a new user
   */
  async addOrUpdate(): Promise<void> {
    let filename = null;
    if (this.photo) {
      filename = await this.uploadService.uploadImage(this.photo)
        .pipe(
          map(
            response => response.file.filename
          ))
        .toPromise();
    }
    /***************** Add user *************************************
     ****************************************************************/
    if (this.router.url === '/manager/settings/users/add-user') {
      const newUser = {
        application_id: this.applicationId,
        company_id: this.utilsService.getCompanyId('ALL', 'ALL'),
        email_address: this.form.value.emailAddress,
        company_email: this.emailAddressStorage,
        user_type: this.form.value.userType,
        staff_type_id: this.form.value.userType,
        first_name: this.form.value.firstName,
        last_name: this.form.value.lastName,
        gender_id: this.form.value.genderProfil,
        prof_phone: this.form.value.profPhone,
        cellphone_nbr: this.form.value.cellphoneNbr,
        language_id: this.form.value.languageCtrl,
        title_id: this.form.value.titleCtrl,
        created_by: this.emailAddressStorage,
        updated_by: this.emailAddressStorage,
        role_code: this.form.value.roleCtrl,
        granted_by: this.emailAddressStorage,
        linkedin_url: this.form.value.linkedinAccount,
        twitter_url: this.form.value.twitterAccount,
        youtube_url: this.form.value.youtubeAccount,
        photo: filename ? filename : ''
      };
      const add = {
        code: 'add',
        title: 'add your account',
      };
      this.subscriptionModal = this.modalService.displayConfirmationModal(add, '528px', '300px').subscribe((value) => {
        if (value) {
          this.profileService.addNewProfile(newUser).subscribe(
            () => {
              this.router.navigate(['/manager/settings/users']);
            },
            (err) => console.error(err),
          );
        }
        this.subscriptionModal.unsubscribe();
      });
      /***************** Update user *************************************
       ****************************************************************/
    } else {
      const updateUser = {
        application_id: this.user['userKey'].application_id,
        email_address: this.userInfo['userKey'].email_address,
        company_email: this.user['company_email'],
        user_type: this.userInfo['user_type'],
        first_name: this.form.value.firstName,
        last_name: this.form.value.lastName,
        gender_id: this.form.value.genderProfil,
        prof_phone: this.form.value.profPhone,
        cellphone_nbr: this.form.value.cellphoneNbr,
        language_id: this.form.value.languageCtrl,
        title_id: this.form.value.titleCtrl,
        updated_by: this.emailAddress,
        linkedin_url: this.form.value.linkedinAccount,
        twitter_url: this.form.value.twitterAccount,
        youtube_url: this.form.value.youtubeAccount,
        photo: filename ? filename : this.userInfo.photo,
      };
      const confirmation = {
        code: 'edit',
        title: 'edit your account',
      };
      this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '528px', '300px').subscribe((value) => {
        if (value) {
          this.subscriptions.push(this.profileService.updateUser(updateUser).subscribe(
            res => {
              if (res) {
                const userRoleObject = {
                  _id: this.idRole,
                  application_id: this.applicationId,
                  email_address: this.emailAddress,
                  role_code: this.form.value.roleCtrl,
                  granted_by: this.emailAddressStorage
                };
                /***************** Current user  *************************************
                 ****************************************************************/
                if (updateUser.email_address === this.emailAddressStorage) {
                  if (this.id) {
                    this.profileService.UpdateUserRole(userRoleObject).subscribe(
                      (data) => {
                        this.infoUser['userroles'][0] = data;
                      }
                    );
                  }
                  this.infoUser['user'][0] = res;
                  this.userService.connectedUser$.next(this.infoUser);
                  if (filename) {
                    this.userService.getImage(filename);
                  }
                  /***************** Administrator update another user *************************************
                   ****************************************************************/
                } else {
                  this.profileService.UpdateUserRole(userRoleObject).subscribe(
                    (data) => {
                      console.log(data);
                    }
                  );
                }
              }
            }));
        }
        this.subscriptionModal.unsubscribe();
      });
    }
    this.photo = null;
  }
  /**
   * @description: Deactivate account
   */
  deactivateAccount(): void {
    const desactivate = {
      code: 'desactivate',
      title: 'desactivate your account',
    };
    this.subscriptionModal = this.modalService.displayConfirmationModal(desactivate, '560px', '300px').subscribe((value) => {
      if (value) {
        console.log('compte desactivé');
      }
      this.subscriptionModal.unsubscribe();
    });

  }

  /**
   * @description: get languages
   */
  getLanguages(): void {
    this.languages = [];
    this.languages = this.appInitializerService.languageList.map((language) => {
      return ({ value: language._id, viewValue: language.language_desc });
    });
  }

  /**
   * @description: clear form
   */
  reset(): void {
    this.form.get('firstName').setValue(null);
    this.form.get('emailAddress').setValue(null);
    this.form.get('lastName').setValue(null);
    this.form.get('genderProfil').setValue(null);
    this.form.get('profPhone').setValue(null);
    this.form.get('cellphoneNbr').setValue(null);
    this.form.get('languageCtrl').setValue(null);
    this.form.get('titleCtrl').setValue(null);
    this.form.get('linkedinAccount').setValue(null);
    this.form.get('twitterAccount').setValue(null);
    this.form.get('youtubeAccount').setValue(null);
  }

  getFile(obj: FormData) {
    this.photo = obj;
  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

  /**
   * @description back
   */
 back() {
    this.location.back();
 }
}
