import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { RoutingStateService } from '@core/services/routingState/routing-state.service';
import { TranslateService } from '@ngx-translate/core';

import { ProfileService } from '@core/services/profile/profile.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ILanguageModel } from '@shared/models/language.model';
import { IUserModel } from '@shared/models/user.model';
import { ModalService } from '@core/services/modal/modal.service';

import { ChangePwdComponent } from '../changepwd/changepwd.component';

@Component({
  selector: 'wid-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  localUrl;
  file: File;
  dataFromLocalStorage: any;
  photochanged = false;
  languageList: ILanguageModel[] = [];
  userInfo;
  companyId: string;
  companyName: string;
  userRole: string;
  user: IUserModel;
  currentUrl: string;
  form: FormGroup;
  refData: any = { };
  data;
  loadData: boolean;
  language_id: string;
  applicationId: string;
  emailAddress: string;
  showCompany: boolean;

  constructor(private utilsService: UtilsService, private translateService: TranslateService,
       private modalService: ModalService, private sanitizer: DomSanitizer,
       private route: ActivatedRoute, private profileService: ProfileService,
       private userService: UserService, private localStorageService: LocalStorageService,
       private appInitializerService: AppInitializerService, private routingState: RoutingStateService,
       private formBuilder: FormBuilder, public dialog: MatDialog) {
       this.applicationId = this.localStorageService.getItem('userCredentials')['application_id'];
       this.emailAddress = this.localStorageService.getItem('userCredentials')['email_address'];
     }

   /**
    * @description Loaded when component in init state
    */
  ngOnInit(): void {
    this.currentUrl = this.routingState.getCurrentUrl();
    this.initForm();
    this.userService.connectedUser$.subscribe((data) => {
     if (!!data) {
        this.data = data;
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.language_id = data['user'][0]['language_id'];
        this.userRole = data['userroles'][0]['userRolesKey']['role_code'];
        this.checkComponentAction(data);
     }
   });
  }

  /**
   * @description : check if the user is in his home profile
   * or the manager wants to add a new profile
   * or he wants to update the profile of one user
   */
  checkComponentAction(connectedUser): void {

    if (this.currentUrl === '/manager/add-user') {
      this.showCompany = false;
      this.getRefdata();
    }
    if (this.currentUrl === '/manager/profile') {
      this.showCompany = true;
      this.applicationId = connectedUser['user'][0]['userKey'].application_id;
      this.userInfo =  connectedUser['user'][0];
      this.language_id = this.userInfo['language_id'];
      this.setForm();
      this.form.controls['userType'].disable();
      this.form.controls['homeCompany'].disable();
      this.form.controls['userRole'].disable();
      this.getRefdata();
    } else {
       this.route.queryParams.subscribe(params => {
         const id = params.id || null;
         if (id) {
         this.showCompany = true;
         this.profileService.getUserById(id).subscribe(user => {
           this.userInfo = user[0];
           this.language_id = this.userInfo['language_id'];
           this.applicationId = this.userInfo['userKey'].application_id;
           this.form.controls['userType'].disable();
           this.form.controls['homeCompany'].disable();
           this.setForm();
         });
     }
   });
   this.getRefdata();
   }
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      companyEmail: ['', [Validators.required, Validators.email]],
      jobTitle: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      genderId: ['', [Validators.required]],
      profPhone: ['', [Validators.required]],
      cellphoneNbr: ['', [Validators.required]],
      language: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      twitterAccount: ['', [Validators.required]],
      youtubeAccount: ['', [Validators.required]],
      linkedinAccount: ['', [Validators.required]],
      homeCompany: ['', [Validators.required]],
    });
  }

  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.setValue({
      emailAddress: this.userInfo['userKey'].email_address,
      companyEmail: this.userInfo['company_email'],
      jobTitle: this.userInfo['title_id'],
      firstName: this.userInfo['first_name'],
      lastName: this.userInfo['last_name'],
      genderId: this.userInfo['gender_id'],
      profPhone: this.userInfo['prof_phone'],
      cellphoneNbr: this.userInfo['cellphone_nbr'],
      language: this.userInfo['language_id'],
      userType: this.userInfo['user_type'],
      userRole: this.userRole,
      twitterAccount: this.userInfo['twitter_url'],
      youtubeAccount: this.userInfo['youtube_url'],
      linkedinAccount: this.userInfo['linkedin_url'],
      homeCompany:  this.companyName,
    });
  }

  /**
   * @description : get the refdata from local storage
   */
  getRefdata(): void {
    const list = ['GENDER', 'PROF_TITLES', 'PROFILE_TYPE', 'ROLE'];
    this.refData = this.utilsService.getRefData(this.companyId, this.applicationId,
      this.language_id , list);
    this.languageList = this.appInitializerService.languageList;
  }

  /**
   * @description: Error control
   */
  get control() {
    return this.form.controls;
  }

  /**
   * @description  : Add New reftype object to database
   */

  onChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePwdComponent, {
      data: { }, disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * @description : get the new photo ready to update
   * @param file : file
   */
  enregister(file): void {
    const maxSizeFile = 2 * 1024 * 1024;
    if (file.target.files[0].size > maxSizeFile) {
      alert('File is too big!');
    } else {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.file = file.target.files[0];

      };
      reader.readAsDataURL(file.target.files[0]);
    }
  }

  /**
   * @description : update the user info
   * or add a new user
   */
  update(): void {
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
        gender_id: this.form.value.genderId,
        prof_phone: this.form.value.profPhone,
        cellphone_nbr: this.form.value.cellphoneNbr,
        language_id: this.form.value.language,
        title_id: this.form.value.jobTitle,
        created_by: this.emailAddress,
        updated_by: this.emailAddress,
        role_code: this.form.value.userRole,
        granted_by: this.emailAddress,
        linkedin_url: this.form.value.linkedinAccount,
        twitter_url: this.form.value.twitterAccount,
        youtube_url: this.form.value.youtubeAccount,
      };
          this.profileService.addNewProfile(newUser).subscribe(
            (res) => console.log(res),
            (err) => console.error(err),
          );
    } else {
          const newUser = {
            application_id: this.userInfo['userKey'].application_id,
            email_address: this.form.value.emailAddress,
            company_email: this.userInfo['company_email'],
            user_type: this.userInfo['user_type'],
            first_name: this.form.value.firstName,
            last_name: this.form.value.lastName,
            gender_id: this.form.value.genderId,
            prof_phone: this.form.value.profPhone,
            cellphone_nbr: this.form.value.cellphoneNbr,
            language_id: this.form.value.language,
            title_id: this.form.value.jobTitle,
            updated_by: this.userInfo['company_email'],
            linkedin_url: this.form.value.linkedinAccount,
            twitter_url: this.form.value.twitterAccount,
            youtube_url: this.form.value.youtubeAccount,
          };
          this.profileService.updateUser(newUser).subscribe(
            res => {
              if (newUser.email_address === this.emailAddress ) {
                this.data['user'][0] = res;
              this.userService.connectedUser$.next(this.data);
            }
            } ,
            err => console.error(err),
          );
        }
 }
}
