import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { LanguageModel } from '../../model/language.model';
import { UtilsService } from '../../../core/services/utils/utils.service'
import { UserInfo } from '../../model/userInfo.model';
import { UserModel } from '../../model/user.model';

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
  languageList: LanguageModel[] = [];
  userInfo = new UserInfo();
  user = new UserModel();
  form: FormGroup;
  refData: any = {};

  constructor(private utilsService: UtilsService, private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initForm();
    // this.utilsService.getRefData('','','','');
    this.profileService.getUser().subscribe(
      res => {
        this.localUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${res.user[0].photo.data.data.buffer}`);
     console.log(this.localUrl ,'sdqsdqsdqsdqsd');
     
        this.userInfo = res;
        this.setForm();
        this.getRefdata();
      }
    )

  }

  initForm(): void {
    this.form = this.formBuilder.group({
      emailAdress: ['', [Validators.required, Validators.email]],
      companyEmail: ['', [Validators.required, Validators.email]],
      jobTitle: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      genderId: ['', [Validators.required]],
      profPhone: ['', [Validators.required]],
      cellphoneNbr: ['', [Validators.required]],
      language: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      twitterAccount: ['', [Validators.required]],
      youtubeAccount: ['', [Validators.required]],
      linkedinAccount: ['', [Validators.required]],
      homeCompany: ['', [Validators.required]],
    });
  }
  setForm(): void {
    this.form.setValue({
      emailAdress: this.userInfo.user[0].UserKey.email_adress,
      companyEmail: this.userInfo.user[0].company_email,
      jobTitle: this.userInfo.user[0].title_id,
      firstname: this.userInfo.user[0].first_name,
      lastname: this.userInfo.user[0].last_name,
      genderId: this.userInfo.user[0].gender_id,
      profPhone: this.userInfo.user[0].prof_phone,
      cellphoneNbr: this.userInfo.user[0].cellphone_nbr,
      language: this.userInfo.user[0].language_id,
      userType: this.userInfo.user[0].user_type,
      twitterAccount: this.userInfo.user[0].twitter_url,
      youtubeAccount: this.userInfo.user[0].youtube_url,
      linkedinAccount: this.userInfo.user[0].linkedin_url,
      homeCompany: this.userInfo.company[0].company_name,

    })
  }

  /**
   * @description : get the refdata from local storage
   */
  getRefdata() {
    const list = ['GENDER', 'PROF_TITLES']
    this.refData = this.utilsService.getRefData(this.userInfo.company[0]._id, this.userInfo.user[0].UserKey.application_id,
      '5eac544ad4cb666637fe1354', list);
    this.languageList = this.utilsService.languageList;
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
    const maxSizeFile = 2 * 1024 * 1024;
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


    this.user.cellphone_nbr = this.form.value.businessPhone;
    this.user.language_id = this.form.value.languages;
    this.user.linkedin_url = this.form.value.you;
    this.user.twitter_url = this.form.value.twitterAccount;
    this.user.youtube_url = this.form.value.youtubeAccount;

    const formData: FormData = new FormData();
    formData.append('file', this.file);

    formData.append('application_id', this.userInfo.user[0].UserKey.application_id);
    formData.append('email_adress', this.userInfo.user[0].UserKey.email_adress);
    formData.append('company_email', this.userInfo.user[0].company_email);
    formData.append('user_type', this.userInfo.user[0].user_type);
    formData.append('first_name', this.form.value.firstname);
    formData.append('last_name', this.form.value.lastname);
    formData.append('gender_id', this.form.value.genderId);
    formData.append('prof_phone', this.form.value.profPhone);
    formData.append('cellphone_nbr', this.form.value.cellphoneNbr);
    formData.append('language_id', this.form.value.language);
    formData.append('title_id', this.form.value.jobTitle);
    formData.append('linkedin_url', this.form.value.linkedinAccount);
    formData.append('twitter_url', this.form.value.twitterAccount);
    formData.append('youtube_url', this.form.value.youtubeAccount);
    formData.append('updated_by', this.userInfo.user[0].UserKey.email_adress);

    console.log(formData);
    

    this.profileService.updateUser(formData).subscribe(res => console.log(res));

  }


}


