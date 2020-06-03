import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { ViewParam } from '../../model/view.model';
import { RefdataModel } from '../../model/refdata.model';
import { ReftypeModel } from '../../model/reftype.model';
import { CompanyModel } from '../../model/company.model';
import { ApplicationModel } from '../../model/application.model';
import { LanguageModel } from '../../model/language.model';
import { MessageModel } from '../../model/message.model';
import { TranslateModel } from '../../model/translate.model';
import { ModuleModel } from '../../model/module.model';
import { UtilsService } from '../../../core/services/utils/utils.service'
import { UserInfo } from '../../model/userInfo.model';

@Component({
  selector: 'wid-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  localUrl;
  file: File;
  dataFromLocalStorage: any;
  photochanged = false;
  languageCode: string;
  genderList: ViewParam[] = [];
  refDataList: RefdataModel[] = [];
  refTypeList: ReftypeModel[] = [];
  companyList: CompanyModel[] = [];
  applicationList: ApplicationModel[] = [];
  languageList: LanguageModel[] = [];
  messagesList: MessageModel[] = [];
  translatesList: TranslateModel[] = [];
  moduleList: ModuleModel[] = [];
  userInfo = new UserInfo();
  form: FormGroup;
  constructor(private utilsService: UtilsService, private sanitizer: DomSanitizer, 
    private profileService: ProfileService,
    private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initForm();
    // this.utilsService.getRefData('','','','');
    this.profileService.getUser().subscribe(
      res => {
        /*this.localUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,` +
       res[0].photo.data);
       this.User = res[0];*/
        this.userInfo = res;
        this.setForm();

      }
    )

  }

  initForm(): void {
    this.form = this.formBuilder.group({
      emailAdress: ['', [Validators.required, Validators.email]],
      companyEmail: ['', [Validators.required, Validators.email]],
      userType: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      genderId: ['', [Validators.required]],
      profPhone: ['', [Validators.required]],
      businessPhone: ['', [Validators.required]],
      languages: ['', [Validators.required]],
      profileType: ['', [Validators.required]],
      twitterAccount: ['', [Validators.required]],
      youtubeAccount: ['', [Validators.required]],
      homeCompany: ['', [Validators.required]],
    });
  }
  setForm(): void {
    this.form.setValue({
      emailAdress: this.userInfo.user[0].UserKey.email_adress,
      companyEmail: this.userInfo.user[0].company_email,
      userType: this.userInfo.user[0].user_type,
      firstname: this.userInfo.user[0].first_name,
      lastname: this.userInfo.user[0].last_name,
      genderId: this.userInfo.user[0].gender_id,
      profPhone: this.userInfo.user[0].prof_phone,
      businessPhone: this.userInfo.user[0].cellphone_nbr,
      languages: this.userInfo.user[0].language_id,
      profileType: this.userInfo.staff[0].StaffKey.staff_type_id,
      twitterAccount: this.userInfo.user[0].twitter_url,
      youtubeAccount: this.userInfo.user[0].youtube_url,
      homeCompany: this.userInfo.company[0].company_name,
    })
  }

/**
 * @description : get the refdata from local storage
 */
  getRefdata(){

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
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      data: {}, disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


  /**
   * @description : get the new photo ready to update
   * @param file : file
   */
  enregister(file): void {
    const maxSizeFile = 5 * 1024 * 1024;


    if (file.target.files[0].size > maxSizeFile) {
      alert('File is too big!');
    }
    else {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.file = file.target.files[0];

      }
      reader.readAsDataURL(file.target.files[0]);
    }
  }


  /**
   * @description : update the user info
   */
  update(): void {

    /* this.User.user[0].UserKey.email_adress = this.form.value.emailAdress;
     this.User.user[0].company_email = this.form.value.companyEmail;
     this.User.staff[0].StaffKey.staff_type_id = this.form.value.userType
     this.User.user[0].first_name = this.form.value.firstname
     this.User.user[0].last_name = this.form.value.lastname;
     this.User.user[0].gender_id = this.form.value.genderId;
     this.User.user[0].prof_phone = this.form.value.profPhone;
     this.User.staff[0].cellphone_nbr = this.form.value.businessPhone;
     this.User.staff[0].language_id = this.form.value.languages;
     this.User.staff[0].title = this.form.value.userType;
     this.User.staff[0].twitter_url = this.form.value.twitterAccount;
     this.User.staff[0].youtube_url = this.form.value.youtubeAccount;
     this.User.company[0].company_name = this.form.value.homeCompany; */
    const formData: FormData = new FormData();
    formData.append('file', this.file);

    formData.append('application_id', '5eac544a92809d7cd5dae21f');
    formData.append('email_adress', 'walid.tenniche@widigital-group.com')
    formData.append('company_email', 'walid.tenniche@widigital-group.com')
    formData.append('user_role_id', 'COMPANY')
    formData.append('first_name', 'reset')
    formData.append('last_name', 'test')
    formData.append('gender_id', '5eac549c1cb2a867dbd0abd1')
    formData.append('prof_phone', '0659254399')
    formData.append('creation_date', '7-5-2020 23:53:6')
    formData.append('created_by', '5-5-2020 10:55:34')
    formData.append('update_date', '27-5-2020 11:6:30')
    formData.append('updated_by', 'walid.tenniche@widigital-group.com')
    formData.append('status', 'A')




    this.profileService.updateUser(formData).subscribe(res => console.log(res)
    )

  }


}


