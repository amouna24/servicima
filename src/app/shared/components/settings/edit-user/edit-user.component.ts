import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';

import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { ModalService } from '@core/services/modal/modal.service';

import { IViewParam } from '@shared/models/view.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { IUserModel } from '@shared/models/user.model';
import { IUserInfo } from '@shared/models/userInfo.model';

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
  photo: FormData;

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
              ) {
    this.applicationId = this.localStorageService.getItem('userCredentials')['application_id'];
    this.emailAddress = this.localStorageService.getItem('userCredentials')['email_address'];
      this.modalService.registerModals(
        { modalName: 'changePassword', modalComponent: ChangePwdComponent});
  }

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
    this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.infoUser = data;
        this.user = data['user'][0];
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.haveImage = data['user'][0]['photo'];
        this.checkComponentAction(data);
      }
    });
    this.userService.avatar$.subscribe(
      avatar => {
        this.avatar = avatar;
      }
    );
  }

  /**
   * @description : check if the user is in his home profile
   * or the manager wants to add a new profile
   * or he wants to update the profile of one user
   */
  checkComponentAction(connectedUser: IUserInfo): void {
    this.showCompany = true;
    this.userRole = connectedUser['userroles'][0]['userRolesKey']['role_code'];
    this.applicationId = connectedUser['user'][0]['userKey'].application_id;
    this.setForm();
    this.form.controls['userType'].disable();
    this.form.controls['homeCompany'].disable();
    this.form.controls['roleCtrl'].disable();
    this.getRefdata();
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      emailAddress: [{ value: '', disabled: true }],
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
      homeCompany: [''],
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
      emailAddress: this.user['userKey'].email_address,
      companyEmail: this.user['company_email'],
      firstName: this.user['first_name'],
      lastName: this.user['last_name'],
      profPhone: this.user['prof_phone'],
      cellphoneNbr: this.user['cellphone_nbr'],
      userType: this.user['user_type'],
      twitterAccount: this.user['twitter_url'],
      youtubeAccount: this.user['youtube_url'],
      linkedinAccount: this.user['linkedin_url'],
      homeCompany: this.companyName,
      genderProfil: this.user['gender_id'],
      roleCtrl: this.userRole,
      languageCtrl: this.user['language_id'],
      titleCtrl: this.user['title_id'],
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
    this.modalService.displayModal('changePassword', null, '50%', '80%');
  }

  /**
   * @description : update the user info
   * or add a new user
   */
  async update(): Promise<void> {
    const newUser = {
      application_id: this.user['userKey'].application_id,
      email_address: this.user['userKey'].email_address,
      company_email: this.user['company_email'],
      user_type: this.user['user_type'],
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
      photo: this.user['photo']
    };

    const confirmation = {
      title: 'edit',
    };
    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '45%', '45%').subscribe((value) => {
      if (value) {
        this.subscriptions.push(this.profileService.updateUser(newUser).subscribe(
          res => {
            if (res) {
              this.infoUser['user'][0] = res;
              this.userService.connectedUser$.next(this.infoUser);
            }
          }));
      }
      this.subscriptionModal.unsubscribe();
    });
  }

  /**
   * @description: Deactivate account
   */
  deactivateAccount(): void {
    const desactivate = {
      title: 'desactivate',
    };
    this.subscriptionModal =  this.modalService.displayConfirmationModal(desactivate, '45%', '45%').subscribe((value) => {
      if (value ) {
        console.log('compte desactivé');
        this.subscriptionModal.unsubscribe();
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
      return ({ value: language._id, viewValue: language.language_desc});
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

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
