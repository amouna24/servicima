import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Country } from '@shared/models/countries.model';
import { ICurrency } from '@shared/models/currency.model';
import { ICities } from '@shared/models/cities.model';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { IUserInfo } from '@shared/models/userInfo.model';
import { IViewParam } from '@shared/models/view.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ILanguageModel } from '@shared/models/language.model';
import { IContractor } from '@shared/models/contractor.model';

@Component({
  selector: 'wid-add-contractor',
  templateUrl: './add-contractor.component.html',
  styleUrls: ['./add-contractor.component.scss']
})
export class AddContractorComponent implements OnInit, OnDestroy {

  /**************************************************************************
   * @description Input from child's Components [SUPPLIERS, CLIENTS]
   *************************************************************************/
  @Input() type: string;
  @Input() title: string;

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**************************************************************************
   * @description Static Customers And Status Declaration
   *************************************************************************/
  countriesList: Country[] = [];
  citiesList: ICities[] = [];
  currenciesList: ICurrency[] = [];
  languagesList: ILanguageModel[] = [];
  vatList: IViewParam[] = [];
  legalFormList: IViewParam[] = [];
  statusList: IViewParam[] = [];

  /**************************************************************************
   * @description Filtered Data Declarations
   *************************************************************************/
  filteredCountries: Observable<Country[]>;
  filteredCities: Observable<ICities[]>;
  filteredCurrencies: Observable<ICurrency[]>;

  /**************************************************************************
   * @description Form Group
   *************************************************************************/
  contractorForm: FormGroup;

  /**************************************************************************
   * @description Declare the new ContractorId to be used on update
   *************************************************************************/
  contractorId: string;

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserInfo;
  contractorInfo: IContractor;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private utilsService: UtilsService,
    private translateService: TranslateService,
    private contractorService: ContractorsService,
    private appInitializerService: AppInitializerService,
    private assetsDataService: AssetsDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.contractorForm = new FormGroup({
    });
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.initContractForm(null);
    this.getInitialData();
    this.route.queryParams
      .subscribe(params => {
        if (this.canUpdate(params.id)) {
          this.contractorId = params.id;
          this.getContractorByID(params.id);
        }
      });

  }

  /**************************************************************************
   * @description Init Contract Form
   *************************************************************************/
  initContractForm(contractor: IContractor) {
    this.contractorForm = this.formBuilder.group({
      contractor_name: [contractor === null ? '' : contractor.contractor_name, Validators.required],
      language: [contractor === null ? '' : contractor.activity_sector],
      registry_code: [contractor === null ? '' : contractor.registry_code],
      legal_form: [contractor === null ? '' : contractor.legal_form],
      vat_nbr: [contractor === null ? '' : contractor.vat_nbr, [Validators.required]],
      address: [contractor === null ? '' : contractor.address],
      city: [contractor === null ? '' : { city: contractor.city}],
      zip_code: [contractor === null ? '' : contractor.zip_code, [Validators.pattern(/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/)]],
      country_cd: [contractor === null ?
        '' : { COUNTRY_DESC: this._filterCountryByCode(contractor.country_cd)[1].COUNTRY_DESC,
               COUNTRY_CODE: this._filterCountryByCode(contractor.country_cd)[1].COUNTRY_CODE
             }
                  ],
      phone_nbr: [contractor === null ? '' : contractor.phone_nbr],
      phone2_nbr: [contractor === null ? '' : contractor.phone2_nbr],
      fax_nbr: [contractor === null ? '' : contractor.fax_nbr],
      contact_email: [contractor === null ? '' : contractor.contact_email, [Validators.required, Validators.email]],
      web_site: [contractor === null ? '' : contractor.web_site],
      currency_cd: [contractor === null ?
        '' : { CURRENCY_DESC: this._filterCurrencyByCode(contractor.currency_cd)[0].CURRENCY_DESC,
               CURRENCY_CODE: this._filterCurrencyByCode(contractor.currency_cd)[0].CURRENCY_CODE
             }
                   ],
      taxe_cd: [contractor === null ? '' : contractor.taxe_cd],
      payment_cd: [contractor === null ? '' : contractor.payment_cd],
    });
  }

  /**************************************************************************
   * @description Get all Initial Data from [ /Assets, Services ]
   * From Assets: [ countries, currencies ]
   * From Services [ RefData, UserInfo ]
   * @return
   * 1 Getting Assets Data with fork join
   * 2 (after subs) Fetch refData [LEGAL_FORM, VAT, CONTRACT_STATUS] and
   * initialize local tables
   * 3 get current UserInfo
   *************************************************************************/
  getInitialData() {
  this.countriesList = this.appInitializerService.countriesList;
  this.currenciesList = this.appInitializerService.currenciesList;
  this.languagesList = this.appInitializerService.languageList;
  this.countryValuesChange();
  this.currenciesValuesChange();
  this.utilsService.getRefData(
    this.utilsService.getCompanyId('ALL', 'ALL'),
    this.utilsService.getApplicationID('ALL'),
    this.translateService.currentLang.slice(0, this.translateService.currentLang.length - 3),
    ['LEGAL_FORM', 'VAT', 'CONTRACT_STATUS']
    );
  this.statusList = this.utilsService.refData['CONTRACT_STATUS'];
  this.vatList = this.utilsService.refData['VAT'];
  this.legalFormList = this.utilsService.refData['LEGAL_FORM'];
  this.userService.connectedUser$.subscribe(
    (userInfo) => {
      this.userInfo = userInfo;
      },
    (error) => {
      console.log(error);
    }
  );
  }
  /* --------- Values changes functions for autocomplete ------------------*/

  /**************************************************************************
   * @description set Filtered Data Table <Observable> with original values
   *************************************************************************/
  countryValuesChange() {
    this.filteredCountries = this.contractorForm.controls.country_cd.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.COUNTRY_DESC),
        map(name => name ? this._filterCountry(name) : this.countriesList.slice()),
      );
  }
  citiesValuesChange() {
    this.filteredCities = this.contractorForm.controls.city.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.city),
        map(name => name ? this._filterCity(name) : this.citiesList.slice())
      );
  }
  currenciesValuesChange() {
    this.filteredCurrencies = this.contractorForm.controls.currency_cd.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.CURRENCY_DESC),
        map(name => name ? this._filterCurrency(name) : this.currenciesList.slice())
      );
  }
  /* ----------------------------------------------------------------------*/

  /* --------------------- Autocomplete Displayed Values ------------------*/

  /**************************************************************************
   * @description AutoComplete Displayed Value
   *************************************************************************/
  displayCountryName(country: Country): string {
    return country && country.COUNTRY_DESC ? country.COUNTRY_DESC : '';
  }
  displayCityName(city: ICities): string {
    return city && city.city ? city.city : '';
  }
  displayCurrencyName(currency: ICurrency): string {
    return currency && currency.CURRENCY_DESC ? currency.CURRENCY_DESC : '';
  }
  /* ----------------------------------------------------------------------*/

  /* -------------------------- Autocomplete Filter -----------------------*/

  /**************************************************************************
   * @description AutoComplete Filtered data
   *************************************************************************/
  private _filterCountry(name: string): Country[] {
    const filterValue = name.toLowerCase();
    return this.countriesList.filter(option => option.COUNTRY_DESC.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterCountryByCode(code: string): Country[] {
    const filterValue = code.toLowerCase();
    return this.countriesList.filter(option => option.COUNTRY_CODE.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterCity(name: string): ICities[] {
    const filterValue = name.toLowerCase();
    return this.citiesList.filter(option => option.city.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterCurrency(name: string): ICurrency[] {
    const filterValue = name.toLowerCase();
    return this.currenciesList.filter(option => option.CURRENCY_DESC.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterCurrencyByCode(code: string): ICurrency[] {
    const filterValue = code.toLowerCase();
    return this.currenciesList.filter(option => option.CURRENCY_CODE.toLowerCase().indexOf(filterValue) === 0);
  }
  /* ----------------------------------------------------------------------*/

  /**************************************************************************
   * @description getCity with Zip Code
   * @param zipCode: number
   * @return city ? city : null
   *************************************************************************/
  getCity(zipCode: string): void {
      this.assetsDataService.getCity(zipCode)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe((city) => {
          this.citiesList = city['cities'];
          this.citiesValuesChange();

    });
  }

  /**************************************************************************
   * @description Create New Contractor
   * get application_id, company_id from userInfo
   * auto generate contractor code
   * get data from Forms
   *************************************************************************/
  addNewContractor() {
    const newC = this.contractorForm.value;
    newC.application_id  = this.userInfo.company[0].companyKey.application_id;
    newC.email_address  = this.userInfo.company[0].companyKey.email_address;
    newC.contractor_code  = `${Math.random().toString(36).substring(7).toUpperCase()}`;
    newC.contractor_type = this.type;
    newC.currency_cd = this.contractorForm.controls.currency_cd.value['CURRENCY_CODE'];
    newC.country_cd = this.contractorForm.controls.country_cd.value['COUNTRY_CODE'];
    newC.creation_date = Date.now();
    newC.update_date = Date.now();
    if (this.canUpdate(this.contractorId)) {
      const updatedC = this.contractorForm.value;
      updatedC.application_id  = this.contractorInfo.contractorKey.application_id;
      updatedC.email_address  = this.contractorInfo.contractorKey.email_address;
      updatedC.contractor_code  = this.contractorInfo.contractorKey.contractor_code;
      updatedC.contractor_type = this.contractorInfo.contractorKey.contractor_type;
      updatedC.currency_cd = this.contractorForm.controls.currency_cd.value['CURRENCY_CODE'];
      updatedC.country_cd = this.contractorForm.controls.country_cd.value['COUNTRY_CODE'];
      updatedC.city = this.contractorForm.controls.city.value['city'];
      updatedC.update_date = Date.now();
      this.contractorService.updateContractor(updatedC).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(
            ['/manager/contract-management/suppliers-contracts/suppliers-list']);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.contractorService.addContractor(newC).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(
            ['/manager/contract-management/suppliers-contracts/suppliers-list']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  /**************************************************************************
   * @description Get Contractor to be updated
   *************************************************************************/
  getContractorByID(_id: string) {
    this.contractorService.getContractors(`?_id=${atob( _id)}`)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        (res) => {
          this.contractorInfo = res[0];
          this.initContractForm(this.contractorInfo);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  /**************************************************************************
   * @description Check if URL contains the ID og
   *************************************************************************/
  canUpdate(_id: any): boolean {
    return _id && _id !== '';
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
