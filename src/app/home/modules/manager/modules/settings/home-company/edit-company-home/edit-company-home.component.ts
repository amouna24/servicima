import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';

import { UtilsService } from '@core/services/utils/utils.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import { ICompanyModel } from '@shared/models/company.model';
import { IUserModel } from '@shared/models/user.model';
import { IViewParam } from '@shared/models/view.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ICity } from '@shared/models/city.model';

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
  ) {
  }

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
    this.userCredentials = this.localStorageService.getItem('userCredentials');
    this.city = { cities: '', code: '' };
    this.initForm();
    this.subscriptions.push(this.userService.connectedUser$.subscribe((info) => {
      if (!!info) {
        this.userInfo = info;
        this.languageId = this.userInfo['user'][0]['language_id'];
        this.company = info['company'][0];
        this.user = info['user'][0];
        this.companyId = this.company['_id'];
        this.applicationId = this.company['companyKey']['application_id'];
        this.getRefdata();
        this.getJsonData();
        this.setForm();
      }
    }, (err) => console.error(err)));
  }

  /**
   * @description : get the refData from local storage
   */
  getRefdata(): void {
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
    this.getRefdata();
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
   * @description : update company profile
   */
  update(): void {
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
    };
    const confirmation = {
      title: 'edit',
    };
    this.subscription = this.modalService.displayConfirmationModal(confirmation, '50%', '40%').subscribe((value) => {
      if (value === true) {
        this.subscriptions.push(this.profileService.updateCompany(companyProfile).subscribe(res => {
          this.userInfo['company'][0] = res;
          this.userService.connectedUser$.next(this.userInfo);
        }, (err) => console.error(err)));
      }
      this.subscription.unsubscribe();
    });
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
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
