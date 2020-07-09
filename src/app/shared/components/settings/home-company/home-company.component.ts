import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilsService } from '@core/services/utils/utils.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ICompanyModel } from '@shared/models/company.model';
import { IUserModel } from '@shared/models/user.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ICity } from '@shared/models/city.model';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-home-company',
  templateUrl: './home-company.component.html',
  styleUrls: ['./home-company.component.scss']
})
export class HomeCompanyComponent implements OnInit, OnDestroy {

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
  countryList: IViewParam[]  = [];
  legalFormList: IViewParam[] = [];
  vatList: IViewParam[] = [];
  activityCodeList: IViewParam[]  = [];
  currenciesList: IViewParam[]  = [];
  /** subscription */
  subscription: Subscription;

  public legalFormCtrl: FormControl = new FormControl('');
  public activityCodeCtrl: FormControl = new FormControl();
  public countryCtrl: FormControl = new FormControl('', Validators.required);
  public registryCountryCtrl: FormControl = new FormControl('', Validators.required);
  public currencyCtrl: FormControl = new FormControl('', Validators.required);
  public vatCtrl: FormControl = new FormControl('', Validators.required);
  /** control for the MatSelect filter keyword */
  public legalFormFilterCtrl: FormControl = new FormControl();
  public countryFilterCtrl: FormControl = new FormControl();
  public activityCodeFilterCtrl: FormControl = new FormControl();
  public registryCountryFilterCtrl: FormControl = new FormControl();
  public currencyFilterCtrl: FormControl = new FormControl();
  public vatFilterCtrl: FormControl = new FormControl();
  /** list filtered by search keyword */
  public filteredLegalForm = new ReplaySubject(1);
  public filteredCountry = new ReplaySubject(1);
  public filteredActivityCode = new ReplaySubject(1);
  public filteredRegistryCountry = new ReplaySubject(1);
  public filteredCurrency = new ReplaySubject(1);
  public filteredVat = new ReplaySubject(1);
  /** subscription */
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.userCredentials = this.localStorageService.getItem('userCredentials');
    this.city = { cities: '', code: '' };
    this.initForm();
    this.subscriptions.push(this.userService.connectedUser$.subscribe((info) => {
      if (!!info) {
        this.userInfo = info;
        this.languageId = this.userInfo['user'][0]['language_id'];
        this.company = info['company'][0];
        this.companyId = this.company['_id'];
        this.applicationId = this.company['companyKey']['application_id'];
        this.getRefdata();
        this.getJsonData();
        this.setForm();
      }
    }, (err) => console.error(err)));
  }

  /**
   * @description : get the refdata from local storage
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
      emailAddress: [{ value: '' , disabled: true }],
      companyName: [{ value: '' , disabled: true }],
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
    });
  }
  /**
   * @description : set from with connected company data
   */
  setForm(): void {
    this.city.cities = [{ city: this.company['city'] }];
    this.countryCtrl.setValue(this.company['country_id']);
    this.registryCountryCtrl.setValue(this.company['registry_country']);
    this.legalFormCtrl.setValue(this.company['legal_form']);
    this.activityCodeCtrl.setValue(this.company['activity_code']);
    this.currencyCtrl.setValue(this.company['currency_id']);
    this.vatCtrl.setValue(this.company['vat_nbr']);
    this.form.setValue({
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
    });
  }

  /**
   * @description: get city
   * @param zipCode: zip code
   * @returns city
   */
  getCity(zipCode: string): void {
    if (this.registryCountryCtrl.value === 'FRA' && this.form.value.zipCode) {
      this.assetsDataService.getCity(zipCode).subscribe((city) => {
        this.city['cities'] = city['cities'];
      }, (err) => console.error(err)) ;
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
      this.utilsService.changeValueField(this.legalFormList, this.legalFormFilterCtrl, this.filteredLegalForm);
      this.utilsService.changeValueField(this.countryList, this.countryFilterCtrl, this.filteredCountry);
      this.utilsService.changeValueField(this.countryList, this.registryCountryFilterCtrl, this.filteredRegistryCountry);
      this.utilsService.changeValueField(this.activityCodeList, this.activityCodeFilterCtrl, this.filteredActivityCode);
      this.utilsService.changeValueField(this.currenciesList, this.currencyFilterCtrl, this.filteredCurrency);
      this.utilsService.changeValueField(this.vatList, this.vatFilterCtrl, this.filteredVat);
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
      registry_country: this.registryCountryCtrl.value,
      reg_nbr: this.form.value.registrationNumber,
      activity_desc: this.form.value.activityDescription,
      activity_code: this.activityCodeCtrl.value,
      currency_id:  this.currencyCtrl.value,
      legal_form: this.legalFormCtrl.value,
      capital: this.form.value.capital,
      vat_nbr: this.vatCtrl.value,
      adress: this.form.value.address,
      zip_code: this.form.value.zipCode,
      country_id: this.countryCtrl.value,
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
      sentence: 'to update this company',
      name: companyProfile.email_address + companyProfile.company_name,
    };

  this.subscription = this.modalService.displayConfirmationModal(confirmation).subscribe((value) => {
      if (value === 'true') {
        this.subscriptions.push( this.profileService.updateCompany(companyProfile).subscribe(res => {
    this.userInfo['company'][0] = res;
   this.userService.connectedUser$.next(this.userInfo);
   }, (err) => console.error(err)));
  }
  this.subscription.unsubscribe();
    });
  }

  /**
   * @description: set Activity description if registry country is France
   * @params Code activity
   */
  setDescriptionActivity(code: string): void {
    if (this.registryCountryCtrl.value === 'FRA') {
      const desc = this.appInitializerService.activityCodeList
        .find(activity => activity.NAF === code).ACTIVITE;
      this.form.controls['activityDescription'].setValue(desc);
    }
  }

  /**
   * @description: : mapping data
   */
  mapData(): void {
    this.appInitializerService.countriesList.forEach((country) => {
      this.countryList.push({ value: country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC });
    });
    this.appInitializerService.activityCodeList.forEach((Code) => {
      this.activityCodeList.push({ value: Code.NAF, viewValue: Code.NAF });
    });
    this.appInitializerService.currenciesList.forEach((currency) => {
      this.currenciesList.push({ value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC });
    });

  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
