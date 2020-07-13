import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subscription, Subject } from 'rxjs';

import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { RoutingStateService } from '@core/services/routingState/routing-state.service';
import { IUserRolesModel } from '@shared/models/userRoles.model';
import { FileUploader } from 'ng2-file-upload';

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

  constructor(private utilsService: UtilsService, private uploadService: UploadService, private route: ActivatedRoute,
    private profileService: ProfileService, private appInitializerService: AppInitializerService,
    private userService: UserService, private localStorageService: LocalStorageService,
    private modalService: ModalService, private routingState: RoutingStateService,
    private formBuilder: FormBuilder, public dialog: MatDialog,
    private sanitizer: DomSanitizer) {
    this.applicationId = this.localStorageService.getItem('userCredentials')['application_id'];
    this.emailAddress = this.localStorageService.getItem('userCredentials')['email_address'];
  }
  files = [];
  url = 'https://evening-anchorage-3159.herokuapp.com/api/';
  uploader: FileUploader;

  public genderCtrl: FormControl = new FormControl('', Validators.required);
  public titleCtrl: FormControl = new FormControl('', Validators.required);
  public languageCtrl: FormControl = new FormControl('', Validators.required);
  public roleCtrl: FormControl = new FormControl('', Validators.required);
  /** control for the MatSelect filter keyword */
  public genderFilterCtrl: FormControl = new FormControl();
  public titleFilterCtrl: FormControl = new FormControl();
  public languageFilterCtrl: FormControl = new FormControl();
  public roleFilterCtrl: FormControl = new FormControl();
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
    console.log('connectedUser', connectedUser);

    if (this.currentUrl === '/manager/add-user') {
      this.form.controls['homeCompany'].setValue(this.companyName);
      this.form.controls['homeCompany'].disable();
      this.showCompany = false;
    } else if (this.currentUrl === '/manager/profile') {
      this.showCompany = true;
      this.userRole = connectedUser['userroles'][0]['userRolesKey']['role_code'];
      this.applicationId = connectedUser['user'][0]['userKey'].application_id;
      this.user = connectedUser['user'][0];
      this.setForm();
      this.form.controls['userType'].disable();
      this.form.controls['homeCompany'].disable();
      this.roleCtrl.disable();
    } else {
      this.route.queryParams.subscribe(params => {
        const id = params.id || null;
        if (id) {
          this.showCompany = true;
          this.subscriptions.push(this.profileService.getUserById(id).subscribe(user => {
            this.user = user[0];
            this.subscriptions.push(this.userService.getUserInfoById(this.user['userKey']['application_id'], this.user['userKey']['email_address']).
              subscribe(((data) => {
                this.userRole = data['userroles'][0]['userRolesKey']['role_code'];
                this.userRoleId = data['userroles'][0]['_id'];
                this.applicationId = this.user['userKey'].application_id;
                this.form.controls['userType'].disable();
                this.form.controls['homeCompany'].disable();
                this.setForm();
              }),
                (err) => console.error(err)));
          }, (err) => console.error(err)));
        }
      }, (err) => console.error(err));
    }

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
    });
  }

  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.roleCtrl.setValue(this.userRole);
    this.languageCtrl.setValue(this.user['language_id']);
    this.genderCtrl.setValue(this.user['gender_id']);
    this.titleCtrl.setValue(this.user['title_id']);
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
    });
    console.log(this.form.value);
    this.getImage(this.user['photo']);
  }

  /**
   * @description : set the Image to UpLoad and preview
   * AND  UPLOAD TO SERVER
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

  async uploadFile(formData) {
    return this.uploadService.uploadImage(formData).pipe(indicate(this.loading$), map(response => response.file.filename)).toPromise();
  }

  /**
   * @description : GET IMAGE FROM BACK AS BLOB
   *  create Object from blob and convert to url
   */
  getImage(id) {
    this.uploadService.getImage(id).subscribe(
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
    this.utilsService.changeValueField(this.titleList, this.titleFilterCtrl, this.filteredTitle);
    this.utilsService.changeValueField(this.languages, this.languageFilterCtrl, this.filteredLanguage);
    this.utilsService.changeValueField(this.genderList, this.genderFilterCtrl, this.filteredGender);
    this.utilsService.changeValueField(this.roleList, this.roleFilterCtrl, this.filteredRole);
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
    if (this.currentUrl === '/manager/add-user') {
      const newUser = {
        application_id: this.applicationId,
        company_id: this.companyId,
        email_address: this.form.value.emailAddress,
        company_email: this.emailAddress,
        user_type: this.form.value.userType,
        staff_type_id: this.form.value.userType,
        first_name: this.form.value.firstName,
        last_name: this.form.value.lastName,
        gender_id: this.genderCtrl.value,
        prof_phone: this.form.value.profPhone,
        cellphone_nbr: this.form.value.cellphoneNbr,
        language_id: this.languageCtrl.value,
        title_id: this.titleCtrl.value,
        created_by: this.emailAddress,
        updated_by: this.emailAddress,
        role_code: this.roleCtrl.value,
        granted_by: this.emailAddress,
        linkedin_url: this.form.value.linkedinAccount,
        twitter_url: this.form.value.twitterAccount,
        youtube_url: this.form.value.youtubeAccount,
        photo: await this.uploadFile(this.photo)

      };
      const confirmation = {
        sentence: 'to add user',
        name: newUser.first_name + newUser.last_name,
      };
      this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation).subscribe((value) => {
        if (value === 'true') {
          this.subscriptions.push(this.profileService.addNewProfile(newUser).subscribe(
            (res) => console.log(res),
            (err) => console.error(err),
          ));
        }
        this.subscriptionModal.unsubscribe();
      });
    } else {
      // user to update
      const newUser = {
        application_id: this.user['userKey'].application_id,
        email_address: this.form.value.emailAddress,
        company_email: this.user['company_email'],
        user_type: this.user['user_type'],
        first_name: this.form.value.firstName,
        last_name: this.form.value.lastName,
        gender_id: this.genderCtrl.value,
        prof_phone: this.form.value.profPhone,
        cellphone_nbr: this.form.value.cellphoneNbr,
        language_id: this.languageCtrl.value,
        title_id: this.titleCtrl.value,
        updated_by: this.emailAddress,
        linkedin_url: this.form.value.linkedinAccount,
        twitter_url: this.form.value.twitterAccount,
        youtube_url: this.form.value.youtubeAccount,
        photo: await this.uploadFile(this.photo)
      };
      console.log('user', newUser);

      // object to update user role
      const user = {
        'application_id': newUser.application_id,
        'email_address': newUser.email_address,
        '_id': this.userRoleId,
        'role_code': this.roleCtrl.value,
        'granted_by': this.emailAddress,
      };

      const confirmation = {
        sentence: 'to update user',
        name: newUser.first_name + newUser.last_name,
      };
      this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation).subscribe((value) => {
        if (value === 'true') {
          this.subscriptions.push(this.profileService.updateUser(newUser).subscribe(
            res => {
              this.infoUser['user'][0] = res;
              if (newUser.email_address === this.emailAddress) {
                if (this.currentUrl === '/manager/profile') {
                  this.userService.connectedUser$.next(this.infoUser);
                } else {
                  this.subscriptions.push(this.profileService.UpdateUserRole(user).subscribe((data) => {
                    this.infoUser['userroles'][0] = data as IUserRolesModel;
                    this.userService.connectedUser$.next(this.infoUser);
                  },
                    (err) => console.error(err)));
                }
              } else {
                this.subscriptions.push(this.profileService.UpdateUserRole(user).subscribe(() => {
                }, (err) => console.error(err)));
              }
            },
            err => console.error(err),
          ));
        }
        this.subscriptionModal.unsubscribe();
      });
    }
  }

  /**
   * @description: get languages
   */
  getLanguages(): void {
    this.languages = [];
    this.appInitializerService.languageList.forEach((language) => {
      this.languages.push({ value: language._id, viewValue: language.language_desc });
    });
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
