import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '../../../core/services/profile/profile.service';
@Component({
  selector: 'wid-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  localUrl;
  file: File;
  photochanged = false;
  User = {
    user: [
      {
        status: 'A',
        _id: '5eb138165d222ed604a98942',
        UserKey: {
          application_id: '5eac544a92809d7cd5dae21f',
          email_adress: 'walid.tenniche@widigital-group.com'
        },
        company_email: 'walid.tenniche@widigital-group.com',
        user_type: 'COMPANY',
        first_name: 'TENNICHE',
        last_name: 'Walid',
        gender_id: '5eac549c1cb2a867dbd0abd1',
        prof_phone: '0659254399',
        photo: '/myPhoto',
        creation_date: '5-5-2020 10:55:34',
        created_by: 'walid.tenniche@widigital-group.com',
        update_date: '5-5-2020 10:55:34',
        updated_by: 'walid.tenniche@widigital-group.com',
        __v: 0
      }
    ],
    credentials: [
      {
        status: 'ACTIVE',
        _id: '5eb135d42e684ea7b4116288',
        creation_date: '5-5-2020 10:45:56',
        created_by: 'walid.tenniche@widigital-group.com',
        update_date: '5-5-2020 10:45:56',
        updated_by: 'walid.tenniche@widigital-group.com',
        last_connection: '7-5-2020 12:9:17'
      }
    ],
    company: [
      {
        status: 'A',
        _id: '5eafff1b0f8dc4b3500c1c4c',
        CompanyKey: {
          application_id: '5eac544a92809d7cd5dae21f',
          email_adress: 'walid.tenniche@widigital-group.com'
        },
        company_name: 'WIDIGITAL SAS',
        registry_country: 'FR',
        reg_nbr: 'ALL',
        legal_form: 'ALL',
        activity_code: 'ALL',
        vat_nbr: 'ALL',
        adress: 'ALL',
        city: 'ALL',
        zip_code: 'ALL',
        country_id: 'ALL',
        phone_nbr: 'ALL',
        currency_id: 'ALL',
        employee_nbr: 0,
        creation_date: '4-5-2020 12:40:11',
        update_date: '4-5-2020 12:40:11',
        __v: 0
      }
    ],
    staff: [
      {
        status: 'A',
        _id: '5eb1b4af2de6ea2aec24693d',
        StaffKey: {
          application_id: '5eac544a92809d7cd5dae21f',
          email_adress: 'walid.tenniche@widigital-group.com',
          staff_type_id: '5eac549d1cb2a867dbd0abfb'
        },
        phone_nbr: '(+33) 1 86 95 46 66',
        cellphone_nbr: '(+33) 6 59 25 43 99',
        language_id: '5eac544ad4cb666637fe1353',
        title: '5eac549c1cb2a867dbd0abe1',
        twitter_url: 'www.twitter.com',
        youtube_url: 'www.youtube.fr',
        __v: 0
      }
    ]

  }
  profiletype = [
    { value: 'manager', viewValue: 'manager' },
    { value: 'user', viewValue: 'user' },
    { value: 'collaborator', viewValue: 'collaborator' },
  ];
  Gendre = [
    { value: 'femme', viewValue: 'femme' },
    { value: 'homme', viewValue: 'homme' },
  ];
  ville = [
    { value: 'tunis', viewValue: 'tunis' },
    { value: 'paris', viewValue: 'paris' },
    { value: 'london', viewValue: 'london' },
  ];
  languages = [
    { value: 'FR', viewValue: 'francais' },
    { value: 'EN', viewValue: 'anglais' },
  ];
  form: FormGroup;
  constructor(private sanitizer: DomSanitizer, private profileService: ProfileService,
    private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    /* this.profileService.getUser().subscribe(
        res => {
          this.localUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,` +
         res[0].photo.data);
         this.User = res[0];
      }
      ) */
    this.initForm();
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
    this.form.setValue({

      emailAdress: this.User.user[0].UserKey.email_adress,
      companyEmail: this.User.user[0].company_email,
      userType: this.User.user[0].user_type,
      firstname: this.User.user[0].first_name,
      lastname: this.User.user[0].last_name,
      genderId: this.User.user[0].gender_id,
      profPhone: this.User.user[0].prof_phone,
      businessPhone: this.User.staff[0].cellphone_nbr,
      languages: this.User.staff[0].language_id,
      profileType: this.User.staff[0].StaffKey.staff_type_id,
      twitterAccount: this.User.staff[0].twitter_url,
      youtubeAccount: this.User.staff[0].youtube_url,
      homeCompany: this.User.company[0].company_name,
    })
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


