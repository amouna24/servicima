import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ReplaySubject, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

import { UtilsService } from '@core/services/utils/utils.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UploadService } from '@core/services/upload/upload.service';

import { ICompanyModel } from '@shared/models/company.model';
import { IUserModel } from '@shared/models/user.model';
import { IViewParam } from '@shared/models/view.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ICity } from '@shared/models/city.model';
import { userType } from '@shared/models/userProfileType.model';

@Component({
  selector: 'wid-edit-company-home',
  templateUrl: './edit-company-home.component.html',
  styleUrls: ['./edit-company-home.component.scss']
})
export class EditCompanyHomeComponent implements OnInit, OnDestroy {

  constructor(private utilsService: UtilsService,
              private profileService: ProfileService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private assetsDataService: AssetsDataService,
              private appInitializerService: AppInitializerService,
              private modalService: ModalService,
              private uploadService: UploadService,
              private location: Location,
              private router: Router,
  ) {
  }
  avatar: any;
  haveImage: any;
  photo: object;
  profileUserType = userType.UT_COMPANY;
  city: ICity;
  userCredentials: string;
  company: ICompanyModel;
  userInfo: IUserInfo;
  companyId: string;
  applicationId: string;
  languageId: string;
  user: IUserModel;
  form: FormGroup;
  countryList: IViewParam[] = [];
  legalFormList: IViewParam[] = [];
  vatList: IViewParam[] = [];
  activityCodeList: IViewParam[] = [];
  currenciesList: IViewParam[] = [];
  /** subscription */
  subscription: Subscription;

  /** list filtered by search keyword */
  public filteredLegalForm = new ReplaySubject(1);
  public filteredCountry = new ReplaySubject(1);
  public filteredActivityCode = new ReplaySubject(1);
  public filteredRegistryCountry = new ReplaySubject(1);
  public filteredCurrency = new ReplaySubject(1);
  public filteredVat = new ReplaySubject(1);
  /** subscription */
  private subscriptions: Subscription[] = [];

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.InitializeData();
    this.initForm();
    this.getCompany();
  }
  /**
   * @description Initialize data
   */
  InitializeData(): void {
    this.avatar = null;
    this.photo = null;
    this.city = { cities: '', code: '' };
    this.userCredentials = this.localStorageService.getItem('userCredentials');
  }

  /**
   * @description get company
   */
  getCompany(): void {
    this.subscriptions.push(this.userService.connectedUser$.subscribe(async (info) => {
      if (!!info) {
        this.userInfo = info;
        this.languageId = this.userInfo['user'][0]['language_id'];
        this.company = info['company'][0];
        this.haveImage = this.company.photo;
        const av = await this.uploadService.getImage(this.company.photo);
        this.avatar = av;
        this.user = info['user'][0];
        this.companyId = this.company['_id'];
        this.applicationId = this.company['companyKey']['application_id'];
        this.getRefData();
        this.getJsonData();
        this.setForm();
      }
    }, (err) => console.error(err)));
  }

  /**
   * @description : get the refData from local storage
   */
  getRefData(): void {
    const list = ['VAT', 'LEGAL_FORM'];
    const refData = this.utilsService.getRefData(this.companyId, this.applicationId,
      list);
    this.legalFormList = refData['LEGAL_FORM'];
    this.vatList = refData['VAT'];
  }

  /**
   * @description : init from
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      emailAddress: [{ value: '', disabled: true }],
      companyName: [{ value: '', disabled: true }],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      registrationNumber: [''],
      activityDescription: [''],
      capital: [''],
      employeeNum: [''],
      webSite: [''],
      contactEmail: [''],
      linkedinAccount: [''],
      twitterAccount: [''],
      youtubeAccount: [''],
      legalFormCtrl: [''],
      activityCodeCtrl: [''],
      currencyCtrl: [''],
      vatCtrl: [''],
      faxNbr: [''],
      phoneNbr1: [''],
      phoneNbr2: [''],
      registryCountryCtrl: ['', [Validators.required]],
      countryCtrl: ['', [Validators.required]],
      legalFormFilterCtrl: [''],
      countryFilterCtrl: [''],
      activityCodeFilterCtrl: [''],
      registryCountryFilterCtrl: [''],
      currencyFilterCtrl: [''],
      vatFilterCtrl: [''],
    });
  }
  /**
   * @description : set from with connected company data
   */
  setForm(): void {
    this.city.cities = [{ city: this.company['city'] }];
    this.form.setValue({
      countryCtrl: this.company['country_id'],
      registryCountryCtrl: this.company['registry_country'],
      legalFormCtrl: this.company['legal_form'],
      activityCodeCtrl: this.company['activity_code'],
      currencyCtrl: this.company['currency_id'],
      vatCtrl: this.company['vat_nbr'],
      emailAddress: this.company.companyKey.email_address,
      companyName: this.company['company_name'],
      address: this.company['adress'],
      city: this.company['city'],
      zipCode: this.company['zip_code'],
      registrationNumber: this.company['reg_nbr'],
      activityDescription: this.company['activity_desc'],
      capital: this.company['capital'],
      employeeNum: this.company['employee_nbr'],
      webSite: this.company['web_site'],
      contactEmail: this.company['contact_email'],
      linkedinAccount: this.company['linkedin_url'],
      twitterAccount: this.company['twitter_url'],
      youtubeAccount: this.company['youtube_url'],
      faxNbr: this.company?.fax_nbr,
      phoneNbr1: (this.company?.phone_nbr1) ? (this.company?.phone_nbr1) : null,
      phoneNbr2: (this.company?.phone_nbr2) ? (this.company?.phone_nbr2) : null,
      legalFormFilterCtrl: '',
      countryFilterCtrl: '',
      registryCountryFilterCtrl: '',
      activityCodeFilterCtrl: '',
      currencyFilterCtrl: '',
      vatFilterCtrl: '',
    });
  }

  /**
   * @description: get city
   * @param zipCode: zip code
   * @returns city
   */
  getCity(zipCode: string): void {
    if (this.form.value.registryCountryCtrl === 'FRA' && this.form.value.zipCode) {
      this.assetsDataService.getCity(zipCode).subscribe((city) => {
        this.city['cities'] = city['cities'];
      }, (err) => console.error(err));
    }
  }

  /**
   * @description get currencies and countries data from json
   */
  getJsonData(): void {
    this.mapData();
    this.getRefData();
    /* load the initial  list */
    this.filteredLegalForm.next(this.legalFormList.slice());
    this.filteredActivityCode.next(this.activityCodeList.slice());
    this.filteredCountry.next(this.countryList.slice());
    this.filteredRegistryCountry.next(this.countryList.slice());
    this.filteredCurrency.next(this.currenciesList.slice());
    this.filteredVat.next(this.vatList.slice());
    /* listen for search field value changes */
    this.utilsService.changeValueField(this.legalFormList, this.form.controls.legalFormFilterCtrl, this.filteredLegalForm);
    this.utilsService.changeValueField(this.countryList, this.form.controls.countryFilterCtrl, this.filteredCountry);
    this.utilsService.changeValueField(this.countryList, this.form.controls.registryCountryFilterCtrl, this.filteredRegistryCountry);
    this.utilsService.changeValueField(this.activityCodeList, this.form.controls.activityCodeFilterCtrl, this.filteredActivityCode);
    this.utilsService.changeValueField(this.currenciesList, this.form.controls.currencyFilterCtrl, this.filteredCurrency);
    this.utilsService.changeValueField(this.vatList, this.form.controls.vatFilterCtrl, this.filteredVat);
    this.utilsService.changeValueField(this.countryList, this.form.controls['countryFilterCtrl'], this.filteredCountry);
    this.utilsService.changeValueField(this.countryList, this.form.controls['registryCountryFilterCtrl'], this.filteredRegistryCountry);
  }

  /**
   * @description : update or edit company profile
   */
  async addOrUpdate(event) {
    if (event.keyCode === 13 || !event.keyCode ) {
      let filename = null;
      if (this.photo) {
        filename = await this.uploadService.uploadImage(this.photo)
          .pipe(
            map(
              response => response.file.filename
            ))
          .toPromise();
      }
      const companyProfile = {
        _id: this.company._id,
        application_id: this.company.companyKey['application_id'],
        email_address: this.company.companyKey.email_address,
        company_name: this.company['company_name'],
        registry_country: this.form.value.registryCountryCtrl,
        reg_nbr: this.form.value.registrationNumber,
        activity_desc: this.form.value.activityDescription,
        activity_code: this.form.value.activityCodeCtrl,
        currency_id: this.form.value.currencyCtrl,
        legal_form: this.form.value.legalFormCtrl,
        capital: this.form.value.capital,
        vat_nbr: this.form.value.vatCtrl,
        adress: this.form.value.address,
        zip_code: this.form.value.zipCode,
        country_id: this.form.value.countryCtrl,
        city: this.form.value.city,
        employee_nbr: this.form.value.employeeNum,
        web_site: this.form.value.webSite,
        contact_email: this.form.value.contactEmail,
        linkedin_url: this.form.value.linkedinAccount,
        twitter_url: this.form.value.twitterAccount,
        youtube_url: this.form.value.youtubeAccount,
        status: this.company.status,
        facebook_url: this.company['facebook_url'],
        phone_nbr: this.company['phone_nbr'],
        photo: filename ? filename : this.company.photo,
        phone_nbr1: this.form.value.phoneNbr1,
        phone_nbr2: this.form.value.phoneNbr2,
        fax_nbr: this.form.value.faxNbr,
      };
      const confirmation = {
        code: 'edit',
        title: 'edit your company',
      };
      this.subscription = this.modalService.displayConfirmationModal(confirmation, '528px', '300px').subscribe((value) => {
        if (value === true) {
          this.subscriptions.push(this.profileService.updateCompany(companyProfile).subscribe(res => {
            this.userInfo['company'][0] = res;
            this.userService.connectedUser$.next(this.userInfo);
            this.router.navigate(['/manager/settings/home-company']);
          }, (err) => console.error(err)));
        }
        this.subscription.unsubscribe();
      });
    }
  }

  /**
   * @description: clear form
   */
  reset(): void {
    this.form.get('registryCountryCtrl').setValue(null);
    this.form.get('registrationNumber').setValue(null);
    this.form.get('activityDescription').setValue(null);
    this.form.get('activityCodeCtrl').setValue(null);
    this.form.get('currencyCtrl').setValue(null);
    this.form.get('legalFormCtrl').setValue(null);
    this.form.get('capital').setValue(null);
    this.form.get('vatCtrl').setValue(null);
    this.form.get('address').setValue(null);
    this.form.get('zipCode').setValue(null);
    this.form.get('countryCtrl').setValue(null);
    this.form.get('city').setValue(null);
    this.form.get('employeeNum').setValue(null);
    this.form.get('webSite').setValue(null);
    this.form.get('contactEmail').setValue(null);
    this.form.get('linkedinAccount').setValue(null);
    this.form.get('twitterAccount').setValue(null);
    this.form.get('youtubeAccount').setValue(null);
    this.form.get('faxNbr').setValue(null);
    this.form.get('phoneNbr2').setValue(null);
    this.form.get('phoneNbr1').setValue(null);
  }

  /**
   * @description: set Activity description if registry country is France
   * @params Code activity
   */
  setDescriptionActivity(code: string): void {
    if (this.form.value.registryCountryCtrl === 'FRA') {
      const desc = this.appInitializerService.activityCodeList
        .find(activity => activity.NAF === code).ACTIVITE;
      this.form.controls['activityDescription'].setValue(desc);
    }
  }

  /**
   * @description: : mapping data
   */
  mapData(): void {
    this.utilsService.getCountry(this.utilsService.getCodeLanguage(this.languageId)).map((country) => {
      this.countryList.push({ value: country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC });
    });
    this.activityCodeList = this.appInitializerService.activityCodeList.map((Code) => {
      return { value: Code.NAF, viewValue: Code.NAF };
    });
    this.currenciesList = this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC };
    });
  }

  /**
   * @description: : get file
   * @param obj: formData
   */
  getFile(obj: FormData) {
    this.photo = obj;
  }

  /**
   * @description back
   */
  back() {
    this.location.back();
  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
