import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { BehaviorSubject, forkJoin, ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
import { IContractorContact } from '@shared/models/contractorContact.model';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { FieldsAlignment, FieldsType, IDynamicForm, InputType } from '@shared/models/dynamic-component/form.model';

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
  gendersList: IViewParam[] = [];
  profTitlesList: IViewParam[] = [];

  /**************************************************************************
   * @description Filtered Data Declarations
   *************************************************************************/
  filteredCurrencies: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredCities: IViewParam[] = [];

  /**************************************************************************
   * @description new Data Declarations 'LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES'
   *************************************************************************/
  filteredCountries: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  langList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  citiesList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  genderList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  legalList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  VATList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  profileTitleList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  activityCodeList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  currencyList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  statList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);

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
  contractorContactInfo: IContractorContact;
  companyEmail: string;

  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  contractorItems: IDynamicMenu[] = [
    {
      title: 'General information',
      titleKey: 'GENERAL_INFORMATION',
      child: [
        {
          title: 'Personal information',
          titleKey: 'PERSONAL_INFORMATION',
        },
        {
          title: 'Address',
          titleKey: 'ADDRESS',
        },
        {
          title: 'General Contact',
          titleKey: 'GENERAL_CONTACT',
        },
        {
          title: 'Organisation',
          titleKey: 'ORGANISATION',
        },
      ]
    },
    {
      title: 'Contact',
      titleKey: 'CONTACT',
      child: []
    },
  ];
  dynamicForm: IDynamicForm[] = [
    {
      titleRef: 'PERSONAL_INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items_with_image_at_right,
      fields: [
        {
          label: 'Social Reason',
          placeholder: 'Social Reason',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'socialReason',
        },
        {
          label: 'Registry number',
          placeholder: 'Registry number',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'registryNumber',
        },
        {
          type: FieldsType.IMAGE,
          imageInputs: {
            avatar: '',
            haveImage: '',
            modelObject: [],
          }
        },
      ],
    },
    {
      titleRef: 'PERSONAL_INFORMATION',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'Language',
          placeholder: 'Language',
          type: FieldsType.SELECT,
          selectFieldList: this.langList,
          formControlName: 'language'
        },
      ],
    },
    {
      titleRef: 'ADDRESS',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Address',
          placeholder: 'Address',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'address',
        },
        {
          label: 'Country',
          placeholder: 'Country',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCountries,
          formControlName: 'registryCountryCtrl',
          searchControlName: 'registryCountryFilterCtrl'
        },
      ],
    },
    {
      titleRef: 'ADDRESS',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'ZIP',
          placeholder: 'ZIP',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'zipCode',
        },
        {
          label: 'City',
          placeholder: 'City',
          type: FieldsType.SELECT,
          selectFieldList: this.citiesList,
          formControlName: 'city',
        },
      ],
    },
    {
      titleRef: 'GENERAL_CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Web Site',
          placeholder: 'Web Site',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'webSite',
        },
        {
          label: 'Email',
          placeholder: 'Email',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'email',
        },
      ],
    },
    {
      titleRef: 'GENERAL_CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Phone 1',
          placeholder: 'Phone 1',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'phoneOne',
        },
        {
          label: 'Email',
          placeholder: 'Phone 2',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'phoneTwo',
        },
      ],
    },
    {
      titleRef: 'GENERAL_CONTACT',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'Fax',
          placeholder: 'Fax',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'fax',
        },
      ],
    },
    {
      titleRef: 'ORGANISATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Activity Sector',
          placeholder: 'Activity Sector',
          type: FieldsType.SELECT,
          selectFieldList: this.activityCodeList,
          formControlName: 'activitySector',
        },
        {
          label: 'Payment Mode',
          placeholder: 'Payment Mode',
          type: FieldsType.SELECT,
          selectFieldList: this.legalList,
          formControlName: 'paymentMode',
        },
      ],
    },
    {
      titleRef: 'ORGANISATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Currency',
          placeholder: 'Currency',
          type: FieldsType.SELECT,
          selectFieldList: this.currencyList,
          formControlName: 'currency',
        },
        {
          label: 'TVA Number',
          placeholder: 'TVA Number',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'tvaNumber',
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'First name',
          placeholder: 'First name',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'contactFirstname',
        },
        {
          label: 'Last name',
          placeholder: 'Last name',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'contactLastname',
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Main Contact',
          placeholder: 'Main Contact',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'mainContact',
        },
        {
          label: 'Email',
          placeholder: 'Email',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'contactEmail',
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Gender',
          placeholder: 'Gender',
          type: FieldsType.SELECT,
          selectFieldList: this.genderList,
          formControlName: 'contactGender',
        },
        {
          label: 'Title',
          placeholder: 'Title',
          type: FieldsType.SELECT,
          selectFieldList: this.profileTitleList,
          formControlName: 'contactTitle',
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Phone',
          placeholder: 'Phone',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'contactPhone',
        },
        {
          label: 'Cellphone',
          placeholder: 'Cellphone',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'contactCellphone',
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'Language',
          placeholder: 'Language',
          type: FieldsType.SELECT,
          selectFieldList: this.langList,
          formControlName: 'contactLanguage'
        },
      ],
    },
  ];
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
    this.utilsService.addIcon(
      [
        { name: 'general', path: '../assets/icons/general.svg'},
        { name: 'credit-card', path: '../assets/icons/credit-card.svg'},
        { name: 'contact', path: '../assets/icons/contact.svg'},
      ]
    );
    this.contractorForm = this.formBuilder.group({
      PERSONAL_INFORMATION: this.formBuilder.group({
        socialReason: ['', Validators.required],
        registryNumber: [],
        language: ['']
      }),
      ADDRESS: this.formBuilder.group({
        address: [''],
        registryCountryCtrl: [''],
        registryCountryFilterCtrl: [''],
        zipCode: [''],
        city: [''],
      }),
      GENERAL_CONTACT: this.formBuilder.group({
        webSite: [''],
        email: ['', [Validators.required, Validators.email]],
        phoneOne: [''],
        phoneTwo: [''],
        fax: [''],
      }),
      ORGANISATION: this.formBuilder.group({
        activitySector: [''],
        paymentMode: [''],
        currency: [''],
        tvaNumber: [''],
      }),
      CONTACT: this.formBuilder.group({
        contactFirstname: [''],
        contactLastname: [''],
        mainContact: [''],
        contactEmail: ['', [Validators.required, Validators.email]],
        contactGender: [''],
        contactTitle: [''],
        contactPhone: [''],
        contactCellphone: [''],
        contactLanguage: [''],
      }),
    });
    this.initContractForm(null, null);
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getInitialData();
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(params => {
        if (params.id) {
          this.contractorId = params.id;
          this.getContractorByID(params);
        }
      });

  }

  /**************************************************************************
   * @description Init Contract Form
   *************************************************************************/
  initContractForm(contractor: IContractor, contractorContact: IContractorContact) {

/*    this.contractorForm = this.formBuilder.group({
      contractor_name: ['', Validators.required],
      language: ['' ],
      registry_code: ['' ],
      legal_form: ['' ],
      vat_nbr: ['' , [Validators.required]],
      address: ['' ],
      city: ['' ],
      zip_code: ['' , [Validators.pattern(/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/)]],
      country_cd: ['' ],
      phone_nbr: ['' ],
      phone2_nbr: ['' ],
      fax_nbr: ['' ],
      contact_email: ['' , [Validators.required, Validators.email]],
      web_site: ['' ],
      currency_cd: ['' ],
      taxe_cd: ['' ],
      payment_cd: ['' ],
      /!* Contractor Contact *!/
      main_contact: [ '' ],
      can_sign_contract: [ '' ],
      first_name: [ '' ],
      last_name: [ '' ],
      gender_cd: [ '' ],
      title_cd: [ '' ],
      phone_nbr_c: [ '' ],
      cell_phone_nbr: [ '' ],

      /!* Filter Form Control *!/
      filteredCountriesControl:  [''],
      filteredCurrencyControl:  [''],
    });*/
  }
  updateForms(contractor: IContractor, contractorContact: IContractorContact) {
    if (contractor) {
      this.getCity(contractor.zip_code, contractor.city, true);
    }
    this.contractorForm.patchValue( {
      contractor_name:  contractor.contractor_name,
      language: contractor.language,
      registry_code:  contractor.registry_code,
      legal_form: contractor.legal_form,
      vat_nbr:  contractor.vat_nbr,
      address: contractor.address,
      city: contractor.city,
      zip_code: contractor.zip_code,
      country_cd: contractor.country_cd,
      phone_nbr : contractor.phone_nbr,
      phone2_nbr : contractor.phone2_nbr,
      fax_nbr : contractor.fax_nbr,
      contact_email : contractor.contact_email,
      web_site : contractor.web_site,
      currency_cd : contractor.currency_cd,
      taxe_cd : contractor.taxe_cd,
      payment_cd : contractor.payment_cd,
      /* Contractor Contact */
      main_contact: contractorContact.main_contact,
      can_sign_contract: contractorContact.can_sign_contract,
      first_name: contractorContact.first_name,
      last_name: contractorContact.last_name,
      gender_cd: contractorContact.gender_cd,
      title_cd: contractorContact.title_cd,
      phone_nbr_c: contractorContact.phone_nbr,
      cell_phone_nbr: contractorContact.cell_phone_nbr,
      /* Filter Form Control */
      filteredCountriesControl:  '',
      filteredCurrencyControl:  '',
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
    this.utilsService.changeValueField(
      this.countriesList,
      this.contractorForm.controls.ADDRESS['controls'].registryCountryFilterCtrl,
      this.filteredCountries
    );
    this.langList.next(this.appInitializerService.languageList.map(
      (obj) => {
       return  { value: obj.LanguageKey.language_code, viewValue: obj.language_desc };
      }
    ));
/*    /!************ get currencies List and next the value to the subject ************!/
    this.filteredCurrencies.next(this.currenciesList.slice());
    this.utilsService.changeValueField(this.currenciesList, this.contractorForm.controls.filteredCurrencyControl, this.filteredCurrencies);*/

    /***************************** get languages List ******************************/
    this.languagesList = this.appInitializerService.languageList;

    this.utilsService.getRefData(
      this.utilsService.getCompanyId('ALL', 'ALL'),
      this.utilsService.getApplicationID('ALL'),
      ['LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES']
    );
    this.statusList = this.utilsService.refData['CONTRACT_STATUS'];
    this.vatList = this.utilsService.refData['VAT'];
    this.legalFormList = this.utilsService.refData['LEGAL_FORM'];
    this.gendersList = this.utilsService.refData['GENDER'];
    this.profTitlesList = this.utilsService.refData['PROF_TITLES'];
    // new
    this.statList.next(this.utilsService.refData['CONTRACT_STATUS']);
    this.VATList.next(this.utilsService.refData['VAT']);
    this.legalList.next(this.utilsService.refData['LEGAL_FORM']);
    this.genderList.next(this.utilsService.refData['GENDER']);
    this.profileTitleList.next(this.utilsService.refData['PROF_TITLES']);
    this.subscriptions.push(this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
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

  keyUpEvent(value) {
    console.log('value', value);
    this.getCity(value, '', false);
  }

  /**************************************************************************
   * @description getCity with Zip Code
   * @param zipCode: number
   * @return city ? city : null
   *************************************************************************/
  getCity(zipCode: string, city: string, update: boolean): void {
    if (/*this.contractorForm.controls.country_cd.value === 'FRA' && this.contractorForm.controls.zip_code.value*/zipCode) {
      this.filteredCities = [];
      this.citiesList.next([]);
      this.assetsDataService.getCity(zipCode)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (arr) => {
            this.filteredCities = arr['cities'];
            this.citiesList.next(arr['cities'].map(
              (obj) => {
                return { value: obj.code, viewValue: obj.city };
              }
            ));
            console.log('cc', this.citiesList.getValue());
          },
          (e) => {
            console.log(e);
          }
        );
    } else if (update) {
      this.filteredCities.push({ viewValue: city, value: '0'});
    }
  }

  /**
   * @description: : mapping data
   */
  mapData(): void {
    this.appInitializerService.countriesList.forEach((country) => {
      this.countriesList.push({ value: country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC});
    });
    this.appInitializerService.currenciesList.forEach((currency) => {
      this.currenciesList.push({ value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC});
    });
    this.currencyList.next(this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC};
    }));
    this.activityCodeList.next(this.appInitializerService.activityCodeList.map((activityCode) => {
     return { value: activityCode.NAF, viewValue: activityCode.NAF };
    }));
  }

  /**************************************************************************
   * @description Create New Contractor
   * get application_id, company_id from userInfo
   * auto generate contractor code
   * get data from Forms
   *************************************************************************/
  addNewContractor() {
    const newContractor = this.contractorForm.value;
    newContractor.application_id = this.userInfo.company[0].companyKey.application_id;
    newContractor.email_address = this.userInfo.company[0].companyKey.email_address;
    newContractor.contractor_code = `${Math.random().toString(36).substring(7).toUpperCase()}`;
    newContractor.contractor_type = this.type;
    newContractor.currency_cd = this.contractorForm.controls.currency_cd.value;
    newContractor.country_cd = this.contractorForm.controls.country_cd.value;
    newContractor.language = this.contractorForm.controls.language.value;
    newContractor.creation_date = Date.now();
    newContractor.update_date = Date.now();
    /* Contractor Contact */
    newContractor.can_sign_contract = this.contractorForm.controls.can_sign_contract.value;
    newContractor.gender_cd = this.contractorForm.controls.gender_cd.value;
    newContractor.title_cd = this.contractorForm.controls.title_cd.value;
    newContractor.language_cd = this.contractorForm.controls.language.value;
    newContractor.phone_nbr = this.contractorForm.controls.phone_nbr_c.value;
    if (this.canUpdate(this.contractorId)) {
      const updatedC = this.contractorForm.value;
      updatedC.application_id = this.contractorInfo.contractorKey.application_id;
      updatedC.email_address = this.contractorInfo.contractorKey.email_address;
      updatedC.contractor_code = this.contractorInfo.contractorKey.contractor_code;
      updatedC.contractor_type = this.contractorInfo.contractorKey.contractor_type;
      updatedC.currency_cd = this.contractorForm.controls.currency_cd.value;
      updatedC.country_cd = this.contractorForm.controls.country_cd.value;
      updatedC.city = this.contractorForm.controls.city.value;
      updatedC.language = this.contractorForm.controls.language.value;
      updatedC.update_date = Date.now();
      /* Contractor Contact */
      updatedC.can_sign_contract = this.contractorForm.controls.can_sign_contract.value;
      updatedC.gender_cd = this.contractorForm.controls.gender_cd.value;
      updatedC.title_cd = this.contractorForm.controls.title_cd.value;
      updatedC.language_cd = this.contractorForm.controls.language.value;
      updatedC.phone_nbr = this.contractorForm.controls.phone_nbr_c.value;
      forkJoin(
        [
          this.contractorService.updateContractor(newContractor),
          this.contractorService.updateContractorContact(newContractor),
        ]
      )
        .pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (res) => {
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
      forkJoin(
        [
          this.contractorService.addContractor(newContractor),
          this.contractorService.addContractorContact(newContractor),
        ]
      )
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
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
  getContractorByID(params) {
    forkJoin([
      this.contractorService.getContractors(`?_id=${atob(params.id)}`),
      this.contractorService.getContractorsContact(`?contractor_code=${atob(params.cc)}&email_address=${atob(params.ea)}`)
    ])
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        (res) => {
          this.contractorInfo = res[0][0];
          this.contractorContactInfo = res[1][0];
          this.updateForms(this.contractorInfo, this.contractorContactInfo);

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

  submit(data: FormGroup) {
    console.log('data', data);
  }

  fetchData(value) {
    this.getCity(value, '', false);
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
