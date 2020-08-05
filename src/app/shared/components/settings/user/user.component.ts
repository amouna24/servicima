import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subscription, Subject } from 'rxjs';

import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { RoutingStateService } from '@core/services/routingState/routing-state.service';

import { IViewParam } from '@shared/models/view.model';
import { ProfileService } from '@core/services/profile/profile.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IUserModel } from '@shared/models/user.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ModalService } from '@core/services/modal/modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadService } from '@core/services/upload/upload.service';
import { map } from 'rxjs/internal/operators/map';
import { indicate } from '@core/services/utils/progress';

import { ChangePwdComponent } from '../changepwd/changepwd.component';

@Component({
  selector: 'wid-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  languages: IViewParam[] = [];
  user: IUserModel;
  companyId: string;
  companyName: string;
  infoUser: IUserInfo;
  userRole: string;
  userRoleId: string;
  currentUrl: string;
  form: FormGroup;
  applicationId: string;
  emailAddress: string;
  showCompany: boolean;
  titleList: IViewParam[];
  genderList: IViewParam[];
  typeList: IViewParam[];
  roleList: IViewParam[];
  avatar: any;
  photo: FormData;
  progress = 0;

  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  loading$ = new Subject<boolean>();

  constructor(private utilsService: UtilsService,
              private uploadService: UploadService,
              private route: ActivatedRoute,
              private profileService: ProfileService,
              private appInitializerService: AppInitializerService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private modalService: ModalService,
              private routingState: RoutingStateService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer, ) {
    this.applicationId = this.localStorageService.getItem('userCredentials')['application_id'];
    this.emailAddress = this.localStorageService.getItem('userCredentials')['email_address'];
  }

  files = [];
  url = 'https://evening-anchorage-3159.herokuapp.com/api/';

  /** list filtered by search keyword */
  public filteredLanguage = new ReplaySubject(1);
  public filteredGender = new ReplaySubject(1);
  public filteredTitle = new ReplaySubject(1);
  public filteredRole = new ReplaySubject(1);

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.currentUrl = this.routingState.getCurrentUrl();
    this.initForm();
    this.subscriptions.push(this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.infoUser = data;
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.checkComponentAction(data);
      }
    }));
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
      this.user = connectedUser['user'][0];
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
      emailAddress: ['', [Validators.required, Validators.email]],
      companyEmail: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      profPhone: [''],
      cellphoneNbr: [''],
      userType: ['', [Validators.required]],
      twitterAccount: [''],
      youtubeAccount: [''],
      linkedinAccount: [''],
      homeCompany: [''],
      roleCtrl: [''],
      genderCtrl: [''],
      titleCtrl: [''],
      languageCtrl: [''],
      genderFilterCtrl: [''],
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
      roleCtrl: this.userRole,
      languageCtrl: this.user['language_id'],
      genderCtrl: this.user['gender_id'],
      titleCtrl: this.user['title_id'],
      genderFilterCtrl: '',
      titleFilterCtrl: '',
      languageFilterCtrl: '',
      roleFilterCtrl: '',
    });
    this.getImage(this.user['photo']);
  }

  /**
   * @description : set the Image to UpLoad and preview
   */
  previewFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
    const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
    formData.append('file', file);
    this.photo = formData;
  }

  /**
   * @description : Upload Image to Server  with async to promise
   */
  async uploadFile(formData) {
    return this.uploadService.uploadImage(formData).pipe(indicate(this.loading$), map(response => response.file.filename)).toPromise();
  }

  /**
   * @description : Clear  preview  Image
   */
  clearPreview() {
    this.photo = null;
    this.avatar = null;
  }

  /**
   * @description : GET IMAGE FROM BACK AS BLOB
   *  create Object from blob and convert to url
   */
  getImage(id) {
    this.uploadService.getImage(id).subscridbe(
      data => {
        const unsafeImageUrl = URL.createObjectURL(data);
        this.avatar = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      }, error => {
        console.log(error);
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
    this.filteredGender.next(this.genderList.slice());
    this.filteredTitle.next(this.titleList.slice());
    this.filteredLanguage.next(this.languages.slice());
    this.filteredRole.next(this.roleList.slice());
    this.utilsService.changeValueField(this.titleList, this.form.controls.titleFilterCtrl, this.filteredTitle);
    this.utilsService.changeValueField(this.languages, this.form.controls.languageFilterCtrl, this.filteredLanguage);
    this.utilsService.changeValueField(this.genderList, this.form.controls.genderFilterCtrl, this.filteredGender);
    this.utilsService.changeValueField(this.roleList, this.form.controls.roleFilterCtrl, this.filteredRole);
  }

  /**
   * @description  : Open dialog change password
   */
  onChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePwdComponent, {
      data: { }, disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  /**
   * @description : update the user info
   * or add a new user
   */
  async update(): Promise<void> {
    const newUser = {
      application_id: this.user['userKey'].application_id,
      email_address: this.form.value.emailAddress,
      company_email: this.user['company_email'],
      user_type: this.user['user_type'],
      first_name: this.form.value.firstName,
      last_name: this.form.value.lastName,
      gender_id: this.form.value.genderCtrl,
      prof_phone: this.form.value.profPhone,
      cellphone_nbr: this.form.value.cellphoneNbr,
      language_id: this.form.value.languageCtrl,
      title_id: this.form.value.titleCtrl,
      updated_by: this.emailAddress,
      linkedin_url: this.form.value.linkedinAccount,
      twitter_url: this.form.value.twitterAccount,
      youtube_url: this.form.value.youtubeAccount,
       photo: await this.uploadFile(this.photo)
    };

    const confirmation = {
      sentence: 'to update user',
      name: newUser.first_name + newUser.last_name,
    };
    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation).subscribe((value) => {
      if (value === 'true') {
        this.subscriptions.push(this.profileService.updateUser(newUser).subscribe(
          res => {
            if (res) {
              /*if (newUser.email_address === this.emailAddress) {
                ;*/
              this.infoUser['user'][0] = res;
              this.userService.connectedUser$.next(this.infoUser);
              this.subscriptionModal.unsubscribe();
            }
          }));
      }
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
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
