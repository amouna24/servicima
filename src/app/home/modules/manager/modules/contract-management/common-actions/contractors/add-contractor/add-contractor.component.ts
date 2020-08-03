import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';
import { ICompanyTaxModel } from '@shared/models/companyTax.model';

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
  private subscriptions: Subscription[] = [];

  /**************************************************************************
   * @description Static Customers And Status Declaration
   *************************************************************************/
  countriesList: IViewParam[] = [];
  currenciesList: IViewParam[] = [];
  languagesList: ILanguageModel[] = [];
  vatList: IViewParam[] = [];
  legalFormList: IViewParam[] = [];
  statusList: IViewParam[] = [];
  companyTaxList: ICompanyTaxModel[] = [];

  /**************************************************************************
   * @description Filtered Data Declarations
   *************************************************************************/
  filteredCountries: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredCurrencies: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredCities: ICities[] = [];

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
  companyEmail: string;

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
    private companyTaxService: CompanyTaxService,
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
    if (contractor) {
      this.getCity(contractor.zip_code, contractor.city, true);
    }
    this.contractorForm = this.formBuilder.group({
      contractor_name: [contractor === null ? '' : contractor.contractor_name, Validators.required],
      language: [contractor === null ? '' : contractor.language],
      registry_code: [contractor === null ? '' : contractor.registry_code],
      legal_form: [contractor === null ? '' : contractor.legal_form],
      vat_nbr: [contractor === null ? '' : contractor.vat_nbr, [Validators.required]],
      address: [contractor === null ? '' : contractor.address],
      city: [contractor === null ? '' :  contractor.city],
      zip_code: [contractor === null ? '' : contractor.zip_code, [Validators.pattern(/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/)]],
      country_cd: [contractor === null ? '' : contractor.country_cd],
      phone_nbr: [contractor === null ? '' : contractor.phone_nbr],
      phone2_nbr: [contractor === null ? '' : contractor.phone2_nbr],
      fax_nbr: [contractor === null ? '' : contractor.fax_nbr],
      contact_email: [contractor === null ? '' : contractor.contact_email, [Validators.required, Validators.email]],
      web_site: [contractor === null ? '' : contractor.web_site],
      currency_cd: [contractor === null ? '' : contractor.currency_cd],
      taxe_cd: [contractor === null ? '' : contractor.taxe_cd],
      payment_cd: [contractor === null ? '' : contractor.payment_cd],
      /* Filter Form Control */
      filteredCountriesControl: [''],
      filteredCurrencyControl: [''],
    });
  }

  /**************************************************************************
   * @description Get all Initial Data from [ /app_initializer, Services ]
   * From Assets: [ countries, currencies ]
   * From Services [ RefData, UserInfo ]
   * @return
   * 1 Getting Assets Data with fork join from app_initializer
   * 2 (after subs) Fetch refData [LEGAL_FORM, VAT, CONTRACT_STATUS] and
   * initialize local tables
   * 3 get current UserInfo
   *************************************************************************/
  getInitialData() {
    this.mapData();
    /************ get countries List and next the value to the subject ************/
    this.filteredCountries.next(this.countriesList.slice());
    this.utilsService.changeValueField(this.countriesList, this.contractorForm.controls.filteredCountriesControl, this.filteredCountries);

    /************ get currencies List and next the value to the subject ************/
    this.filteredCurrencies.next(this.currenciesList.slice());
    this.utilsService.changeValueField(this.currenciesList, this.contractorForm.controls.filteredCurrencyControl, this.filteredCurrencies);

    /***************************** get languages List ******************************/
    this.languagesList = this.appInitializerService.languageList;

    this.utilsService.getRefData(
      this.utilsService.getCompanyId('ALL', 'ALL'),
      this.utilsService.getApplicationID('ALL'),
      ['LEGAL_FORM', 'VAT', 'CONTRACT_STATUS']
    );
    this.statusList = this.utilsService.refData['CONTRACT_STATUS'];
    this.vatList = this.utilsService.refData['VAT'];
    this.legalFormList = this.utilsService.refData['LEGAL_FORM'];
    this.subscriptions.push(this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        console.log(data.user[0]['company_email']);
        this.userInfo = data;
        this.companyEmail = data.user[0]['company_email'];
        this.getCompanyTax();
      }
    }));
  }

  /**************************************************************************
   * @description get Tax for specific company
   *************************************************************************/
  getCompanyTax() {
    this.companyTaxService.getCompanyTax(this.companyEmail)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (companyTax) => {
          this.companyTaxList = companyTax;
        },
      (error) => {
        console.log(error);
        }
      );
  }

  /* ----------------------------------------------------------------------*/

  /**************************************************************************
   * @description getCity with Zip Code
   * @param zipCode: number
   * @return city ? city : null
   *************************************************************************/
  getCity(zipCode: string, city: string, update: boolean): void {
    if (this.contractorForm.controls.country_cd.value === 'FRA' && this.contractorForm.controls.zip_code.value) {
      this.filteredCities = [];
      this.assetsDataService.getCity(zipCode)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (arr) => {
            console.log(arr);
            this.filteredCities = arr['cities'];
          },
          (e) => {
            console.log(e);
          }
      );
    } else if (update) {
      this.filteredCities.push({ city, code: 0});
    }
  }

  /**
   * @description: : mapping data
   */
  mapData(): void {
    this.appInitializerService.countriesList.forEach((country) => {
      this.countriesList.push({ value: country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC });
    });
    this.appInitializerService.currenciesList.forEach((currency) => {
      this.currenciesList.push({ value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC });
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
    newC.currency_cd = this.contractorForm.controls.currency_cd.value;
    newC.country_cd = this.contractorForm.controls.country_cd.value;
    newC.language = this.contractorForm.controls.language.value;
    newC.creation_date = Date.now();
    newC.update_date = Date.now();
    if (this.canUpdate(this.contractorId)) {
      const updatedC = this.contractorForm.value;
      updatedC.application_id  = this.contractorInfo.contractorKey.application_id;
      updatedC.email_address  = this.contractorInfo.contractorKey.email_address;
      updatedC.contractor_code  = this.contractorInfo.contractorKey.contractor_code;
      updatedC.contractor_type = this.contractorInfo.contractorKey.contractor_type;
      updatedC.currency_cd = this.contractorForm.controls.currency_cd.value;
      updatedC.country_cd = this.contractorForm.controls.country_cd.value;
      updatedC.city = this.contractorForm.controls.city.value;
      updatedC.language = this.contractorForm.controls.language.value;
      updatedC.update_date = Date.now();
      this.contractorService.updateContractor(updatedC).subscribe(
        (res) => {
          console.log('updated successfully', res);
          if (this.type === 'CUSTOMER') {
            this.router.navigate(
              ['/manager/contract-management/clients-contracts/clients-list']);
          } else if (this.type === 'SUPPLIER') {
            this.router.navigate(
              ['/manager/contract-management/suppliers-contracts/suppliers-list']);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.contractorService.addContractor(newC).subscribe(
        (response) => {
          console.log('added successfully', response);
          if (this.type === 'CUSTOMER') {
            this.router.navigate(
              ['/manager/contract-management/clients-contracts/clients-list']);
          } else if (this.type === 'SUPPLIER') {
            this.router.navigate(
              ['/manager/contract-management/suppliers-contracts/suppliers-list']);
          }
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
