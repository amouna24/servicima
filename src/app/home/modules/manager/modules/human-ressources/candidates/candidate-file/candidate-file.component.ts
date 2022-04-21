import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICandidateModel } from '@shared/models/candidate.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { BehaviorSubject, forkJoin, ReplaySubject, Subject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { FieldsAlignment, FieldsType, IDynamicForm, InputType } from '@shared/models/dynamic-component/form.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@core/services/utils/utils.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { IUserModel } from '@shared/models/user.model';
import { userType } from '@shared/models/userProfileType.model';
import { UploadService } from '@core/services/upload/upload.service';
import { map, takeUntil } from 'rxjs/operators';
import { CandidateService } from '@core/services/candidate/candidate.service';
import { TestService } from '@core/services/test/test.service';

@Component({
  selector: 'wid-candidate-file',
  templateUrl: './candidate-file.component.html',
  styleUrls: ['./candidate-file.component.scss']
})
export class CandidateFileComponent implements OnInit {
  title = 'Fiche candidate';
  profileForm: FormGroup;
  candidateInfo: ICandidateModel;
  userInfo: IUserInfo;
  userModel: IUserModel;
  refData = { };
  destroy$: Subject<boolean> = new Subject<boolean>();
  countriesList: IViewParam[] = [];
  nationalitiesList: IViewParam[] = [];
  genderList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  filteredCountries: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredNationalities: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  documentTypeList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  isLoadingImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  listBlocQuestion: any;
  /**************************************************************************
   * @description candidate Image
   *************************************************************************/
  avatar: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  haveImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  photo: FormData = null;
  /**************************************************************************
   * @description Candidate key
   *************************************************************************/
  id: string;
  companyEmail: string;
  applicationId: string;
  emailAddress: string;
  /**************************************************************************
   * @description Dynamic Component
   *************************************************************************/
  isLoading = new BehaviorSubject<boolean>(false);
  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  profileItems: IDynamicMenu[] = [
    {
      title: 'personal_data_all',
      titleKey: 'PERSONAL_DATA',
      child: []
    },
    {
      title: 'identity_doc_all',
      titleKey: 'IDENTITY_DOCUMENT',
      child: []
    },
  ];
  /**************************************************************************
   * @description Dynamic Form
   *************************************************************************/
  dynamicForm: BehaviorSubject<IDynamicForm[]> = new BehaviorSubject<IDynamicForm[]>([
    {
      'titleRef': 'PERSONAL_DATA',
      'fieldsLayout': FieldsAlignment.tow_items_with_image_at_right,
      'fields': [
        {
          label: 'first_name_all',
          placeholder: 'first_name_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'first_name',
          required: true

        },
        {
          label: 'last_name_all',
          placeholder: 'last_name_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'last_name',
          required: true
        },
        {
          type: FieldsType.IMAGE,
          imageInputs: {
            avatar: this.avatar,
            haveImage:  this.haveImage,
            modelObject:  this.userModel,
            singleUpload: false,
            userType: userType.UT_CONTRACTOR,
            imageLoading: this.isLoadingImage
          }
        },
      ],
    },
    {
      titleRef: 'PERSONAL_DATA',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'email_all',
          placeholder: 'exp@email.com',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'email_address',
          required: true
        },
        {
          label: 'phone_all',
          placeholder: '+216 123 456 78',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'phone',
          required: true
        },
      ],
    },
    {
      titleRef: 'PERSONAL_DATA',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'birth_date_all',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'birth_date',
          required: true

        },
        {
          label: 'gender_all',
          placeholder: 'Gender',
          type: FieldsType.SELECT,
          selectFieldList: this.genderList,
          formControlName: 'gender_id',
          required: true
        },
      ],
    },
    {
      titleRef: 'PERSONAL_DATA',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'birth_country_all',
          placeholder: 'birth_country_all',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCountries,
          formControlName: 'birth_country_id',
          searchControlName: 'countryBirthFilterCtrl',
          required: true

        },
        {
          label: 'birth_city_all',
          placeholder: 'birth_city_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'birth_city',
          required: true
        },
      ],
    },
    {
      titleRef: 'PERSONAL_DATA',
      fieldsLayout: FieldsAlignment.one_item_stretch,
      fields: [
        {
          label: 'address_label_all',
          placeholder: 'address_placeholder_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'adress',
          required: true
        },
      ],
    },
    {
      titleRef: 'PERSONAL_DATA',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'country_all',
          placeholder: 'country_all',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCountries,
          formControlName: 'country_code',
          searchControlName: 'countryFilterCtrl',
          required: true
        },
        {
          label: 'Zip',
          placeholder: 'zip_code',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'zip_code',
          required: true
        },
      ],
    },
    {
      titleRef: 'PERSONAL_DATA',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Ville',
          placeholder: 'Ville',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'city',
          required: true,
        },
        {
          label: 'natio_all',
          placeholder: 'natio_all',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredNationalities,
          searchControlName: 'nationalityFilterCtrl',
          formControlName: 'nationality_id',
          required: true
        },
      ],
    },
    {
      titleRef: 'PERSONAL_DATA',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'Annee experience',
          placeholder: 'Anne experience',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'experience_years',
          required: true,
        },
      ],
    },
    {
      titleRef: 'IDENTITY_DOCUMENT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'doc_type_all',
          placeholder: 'doc_type_all',
          type: FieldsType.SELECT,
          selectFieldList: this.documentTypeList,
          formControlName: 'identity_type_id',
        },
        {
          label: 'Identity number',
          placeholder: 'Anne experience',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'identity_nbr',
        },
      ],
    },
    {
      titleRef: 'IDENTITY_DOCUMENT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Validity start date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'validity_start_date',
        },
        {
          label: 'Validity end date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'validity_end_date',
        },
      ],
    },
  ]);

  constructor(
      private appInitializerService: AppInitializerService,
      private route: ActivatedRoute,
      private utilsService: UtilsService,
      private formBuilder: FormBuilder,
      private refDataService: RefdataService,
      private localStorageService: LocalStorageService,
      private router: Router,
      private profileService: ProfileService,
      private uploadService: UploadService,
      private candidateService: CandidateService,
      private testService: TestService

  ) {
    this.getDataFromLocalStorage();
    this.initProfileForm();
    this.route.queryParams
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe( async params => {
          if (params.id) {
            this.id = atob(params.id);
            this.emailAddress = atob(params.ec);
            this.disableFieldsCandidate();
            await this.getRefData(this.companyEmail);
            await this.getUserData(params);
            this.getBlocQuestionTest().then(data => this.listBlocQuestion = data);
          }
        });
  }

  ngOnInit(): void {

  }
  /**************************************************************************
   * @description Init form with initial data
   *************************************************************************/
  initProfileForm() {
    this.profileForm = this.formBuilder.group({
      PERSONAL_DATA: this.formBuilder.group({
        application_id: [''],
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email_address: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        city: ['', [Validators.required]],
        birth_date: ['', [Validators.required]],
        gender_id: ['', [Validators.required]],
        birth_country_id: ['', [Validators.required]],
        birth_city: ['', [Validators.required]],
        adress: ['', [Validators.required]],
        experience_years: ['', [Validators.required]],
        country_code: ['', [Validators.required]],
        countryFilterCtrl: [''],
        countryBirthFilterCtrl: [''],
        zip_code: ['', [Validators.required]],
        nationality_id: ['', [Validators.required]],
        nationalityFilterCtrl: [''],
      }),
      IDENTITY_DOCUMENT: this.formBuilder.group({
        identity_type_id: [''],
        identity_nbr: [''],
        validity_start_date: [''],
        validity_end_date: [''],
      }),

    });
  }
  /**
   * @description get connected user from local storage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.companyEmail = cred['email_address'];
    this.applicationId = cred['application_id'];
  }

  /**
   * @description update form
   */
  updateForm(user: IUserModel, candidate: ICandidateModel) {
    this.isLoading.next(false);
   this.profileForm.patchValue({
     PERSONAL_DATA: {
       application_id: this.applicationId,
       first_name: user.first_name,
       last_name: user.last_name,
       email_address: user.userKey.email_address,
       phone: user.prof_phone,
       birth_date: candidate.birth_date,
       gender_id: user.gender_id,
       birth_country_id: candidate.birth_country_id,
       birth_city: candidate.birth_city,
       city: candidate.city,
       adress: candidate.adress,
       experience_years: candidate.experience_years,
       country_code: candidate.country_code,
       zip_code: candidate.zip_code,
       nationality_id: candidate.nationality_id,
     },
     IDENTITY_DOCUMENT: {
       identity_type_id: candidate.identity_type_id,
       identity_nbr: candidate.identity_nbr,
       validity_start_date: candidate.validity_start_date,
       validity_end_date: candidate.validity_end_date,
     }
   });
  }
  /**
   * @description get user info
   */
 async getUserData(params) {
   this.isLoading.next(true);
   forkJoin([
       this.profileService.getUserById(atob(params.id)),
       this.candidateService.getCandidate(`?email_address=${atob(params.ec)}`)
   ]).pipe(
       takeUntil(this.destroy$)
   ).subscribe(async (res) => {
      this.userModel = res[0]['results'][0];
     this.utilsService
         .getNationality(
             this.utilsService
                 .getCodeLanguage(this.userModel.language_id)).map((nationality) => {
       this.nationalitiesList.push({ value: nationality.NATIONALITY_CODE, viewValue: nationality.NATIONALITY_DESC });
     });
     this.filteredNationalities.next(this.nationalitiesList.slice());
     this.utilsService.changeValueField(
         this.nationalitiesList,
         this.profileForm.controls.PERSONAL_DATA['controls'].countryBirthFilterCtrl,
         this.filteredNationalities
     );
     this.haveImage.next(res[0]['results'][0]['photo']);
     this.avatar.next(await this.uploadService.getImage(res[0]['results'][0]['photo']));
     this.isLoadingImage.next(false);
     if (res[1] !== []) {
       this.candidateInfo = res[1][0];
     }
     this.updateForm(this.userModel, this.candidateInfo);
   });
  }

  /**
   * @description submit
   */
  async save(data: FormGroup) {
    let filename = null;
    if (this.photo) {
      filename = await this.uploadService.uploadImage(this.photo)
          .pipe(
              map(
                  response => {
                  return  response.file.filename;
                  }
              ))
          .toPromise();
    }
    this.userModel.photo = filename ? filename : this.userModel.photo;
    const obj = { ...this.userModel.userKey, ...this.userModel};
    const Candidate: ICandidateModel = {
      _id: this.candidateInfo._id,
      application_id: this.profileForm.controls.PERSONAL_DATA['controls'].application_id.value,
      email_address: this.profileForm.controls.PERSONAL_DATA['controls'].email_address.value,
      adress: this.profileForm.controls.PERSONAL_DATA['controls'].adress.value,
      zip_code: this.profileForm.controls.PERSONAL_DATA['controls'].zip_code.value,
      city: this.profileForm.controls.PERSONAL_DATA['controls'].city.value,
      country_code: this.profileForm.controls.PERSONAL_DATA['controls'].country_code.value,
      experience_years: this.profileForm.controls.PERSONAL_DATA['controls'].experience_years.value,
      birth_date: this.profileForm.controls.PERSONAL_DATA['controls'].birth_date.value,
      birth_city: this.profileForm.controls.PERSONAL_DATA['controls'].birth_city.value,
      birth_country_id: this.profileForm.controls.PERSONAL_DATA['controls'].birth_country_id.value,
      nationality_id: this.profileForm.controls.PERSONAL_DATA['controls'].nationality_id.value,
      identity_nbr: this.profileForm.controls.IDENTITY_DOCUMENT['controls'].identity_nbr.value,
      validity_start_date: this.profileForm.controls.IDENTITY_DOCUMENT['controls'].validity_start_date.value,
      validity_end_date: this.profileForm.controls.IDENTITY_DOCUMENT['controls'].validity_end_date.value,
      identity_type_id: this.profileForm.controls.IDENTITY_DOCUMENT['controls'].identity_type_id.value,
      licence_id: this.candidateInfo.licence_id,
      status: this.candidateInfo.status,
      type: '',
      candidateKey: this.candidateInfo.candidateKey
    };
    this.candidateService.updateCandidate(Candidate).subscribe((res) => {
      this.profileService.updateUser(obj).subscribe((resUser) => {
        this.utilsService.openSnackBar('update successfully', 'close', 3000);

      });
    });
  }

  /**
   * @description disable field
   */
  disableFieldsCandidate() {
    this.profileForm.controls.PERSONAL_DATA['controls'].first_name.disable();
    this.profileForm.controls.PERSONAL_DATA['controls'].last_name.disable();
    this.profileForm.controls.PERSONAL_DATA['controls'].email_address.disable();
    this.profileForm.controls.PERSONAL_DATA['controls'].phone.disable();
    this.profileForm.controls.PERSONAL_DATA['controls'].gender_id.disable();
  }
  /**************************************************************************
   * @description get selected Action From Dynamic Component
   * @param rowAction Object { data, rowAction }
   * data _id
   * rowAction [show, update, delete]
   *************************************************************************/
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): console.log('show');
        break;
      case ('update'): console.log('update');
        break;
      case('delete'):  console.log('delete');
    }
  }
  /**************************************************************************
   * @description Create/Update New/Old Collaborator Informations
   * @param result
   * result.action: ['update', addMore]
   *************************************************************************/
  addInfo(result) {

  }
  /**************************************************************************
   * @description get the selected Image From Dynamic Component
   * @param obj FormData
   *************************************************************************/
  getFile(obj: FormData) {
    this.photo = obj;
  }

  /**
   * @description ref data
   */
  async getRefData(companyEmail: string) {
    /********************************** REF DATA **********************************/
    this.refData = await this.refDataService.getRefData(
        this.utilsService.getCompanyId(
            companyEmail,
            this.localStorageService.getItem('userCredentials')['application_id']),
        this.localStorageService.getItem('userCredentials')['application_id'],
        [ 'GENDER', 'IDENTITY_TYPE'],
        false
    );
    this.appInitializerService.countriesList.forEach((country) => {
      this.countriesList.push({ value : country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC});
    });
    this.filteredCountries.next(this.countriesList.slice());
    this.utilsService.changeValueField(
        this.countriesList,
        this.profileForm.controls.PERSONAL_DATA['controls'].countryFilterCtrl,
        this.filteredCountries
    );
    this.utilsService.changeValueField(
        this.countriesList,
        this.profileForm.controls.PERSONAL_DATA['controls'].countryBirthFilterCtrl,
        this.filteredCountries
    );
    this.genderList.next(this.refData['GENDER']);
    this.documentTypeList.next(this.refData['IDENTITY_TYPE']);

  }

  /**
   * @description check date
   */
  checkDate(date: Date) {

  }
  /**
   * @description get blocs question
   */
  getBlocQuestionTest() {
    console.log('my language ', this.localStorageService.getItem('language'));
    return new Promise<any>(resolve => {
        this.testService
            .getQuestionBloc
            (`?application_id=${this.applicationId}&company_email=ALL&language_id=${
                this.localStorageService.getItem('language').langId}`).subscribe((data) => {
                console.log('my data ', data);
              resolve(data);
        });
    });
  }

}
