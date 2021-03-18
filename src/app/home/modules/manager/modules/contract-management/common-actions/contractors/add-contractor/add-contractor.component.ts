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
import { IContractor } from '@shared/models/contractor.model';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';
import { IContractorContact } from '@shared/models/contractorContact.model';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { FieldsAlignment, FieldsType, IDynamicForm, InputType } from '@shared/models/dynamic-component/form.model';
import { userType } from '@shared/models/userProfileType.model';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  isLoading = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];

  /**************************************************************************
   * @description new Data Declarations 'LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES'
   *************************************************************************/
  countriesList: IViewParam[] = [];
  filteredCountries: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  langList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  citiesList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  genderList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  legalList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  profileTitleList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  activityCodeList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  currencyList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  statusList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  paymentModeList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  companyTaxList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);

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
   * @description User Image
   *************************************************************************/
  avatar: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  haveImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  photo: FormData;
  backURL: string;

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
            avatar: this.avatar,
            haveImage: this.haveImage,
            modelObject: this.contractorInfo,
            singleUpload: false,
            userType: userType.UT_CONTRACTOR,
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
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
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
          label: 'Phone 2',
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
          selectFieldList: this.paymentModeList,
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
          label: 'VAT Number',
          placeholder: 'VAT Number',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'vatNumber',
        },
      ],
    },
    {
      titleRef: 'ORGANISATION',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'Legal Form',
          placeholder: 'Legal Form',
          type: FieldsType.SELECT,
          selectFieldList: this.legalList,
          formControlName: 'legalForm',
        },
        {
          label: 'Company Tax',
          placeholder: 'Company Tax',
          type: FieldsType.SELECT,
          selectFieldList: this.companyTaxList,
          formControlName: 'companyTax',
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
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Language',
          placeholder: 'Language',
          type: FieldsType.SELECT,
          selectFieldList: this.langList,
          formControlName: 'contactLanguage'
        },
        {
          label: 'Signature',
          type: FieldsType.SLIDE_TOGGLE,
          formControlName: 'canSign'
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
    private uploadService: UploadService,
    private sanitizer: DomSanitizer,
  ) {
    this.initContractForm();
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
    if (this.type === 'CUSTOMER') {
      this.backURL = '/manager/contract-management/clients-contracts/clients-list';
    } else if (this.type === 'SUPPLIER') {
      this.backURL = '/manager/contract-management/suppliers-contracts/suppliers-list';
    }
  }

  /**************************************************************************
   * @description Init Contract Form
   *************************************************************************/
  initContractForm() {
    this.contractorForm = this.formBuilder.group({
      PERSONAL_INFORMATION: this.formBuilder.group({
        socialReason: ['', Validators.required],
        registryNumber: [],
        language: [''],
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
        vatNumber: [''],
        legalForm: [''],
        companyTax: [''],
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
        canSign: [''],
      }),
    });
  }

  updateForms(contractor: IContractor, contractorContact: IContractorContact) {
    this.contractorForm.patchValue({
      PERSONAL_INFORMATION : {
        socialReason: contractor.contractor_name,
        registryNumber: contractor.registry_code,
        language: contractor.language,
      },
      ADDRESS: {
        address: contractor.address,
        registryCountryCtrl: contractor.country_cd,
        registryCountryFilterCtrl: '',
        zipCode: contractor.zip_code,
        city: contractor.city,
      },
      GENERAL_CONTACT: {
        webSite: contractor.web_site,
        email: contractor.contact_email,
        phoneOne: contractor.phone_nbr,
        phoneTwo: contractor.phone2_nbr,
        fax: contractor.fax_nbr,
      },
      ORGANISATION: {
        activitySector: contractor.activity_sector,
        paymentMode: contractor.payment_cd,
        currency: contractor.currency_cd,
        vatNumber: contractor.vat_nbr,
        legalForm: contractor.legal_form,
        companyTax: contractor.taxe_cd,
      },
      CONTACT: {
        contactFirstname: contractorContact.first_name,
        contactLastname: contractorContact.last_name,
        mainContact:  contractorContact.main_contact,
        contactEmail: contractorContact.contractorContactKey.contact_email,
        contactGender: contractorContact.gender_cd,
        contactTitle: contractorContact.title_cd,
        contactPhone: contractorContact.phone_nbr,
        contactCellphone: contractorContact.cell_phone_nbr,
        contactLanguage: contractorContact.language_cd,
        canSign: contractorContact.can_sign_contract,
      },
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
    /********************************** COUNTRY **********************************/
    this.appInitializerService.countriesList.forEach((country) => {
      this.countriesList.push({ value: country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC});
    });
    /***************************** FILTERED COUNTRY *******************************/
    this.filteredCountries.next(this.countriesList.slice());
    this.utilsService.changeValueField(
      this.countriesList,
      this.contractorForm.controls.ADDRESS['controls'].registryCountryFilterCtrl,
      this.filteredCountries
    );
    /********************************** LANGUAGE **********************************/
    this.langList.next(this.appInitializerService.languageList.map(
      (obj) => {
       return  { value: obj.LanguageKey.language_code, viewValue: obj.language_desc };
      }
    ));
    /********************************** CURRENCY **********************************/
    this.currencyList.next(this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC};
    }));
    /******************************** ACTIVITY CODE *******************************/
    this.activityCodeList.next(this.appInitializerService.activityCodeList.map((activityCode) => {
      return { value: activityCode.NAF, viewValue: activityCode.NAF };
    }));
    /********************************** REF DATA **********************************/
    this.utilsService.getRefData(
      this.utilsService.getCompanyId('ALL', 'ALL'),
      this.utilsService.getApplicationID('ALL'),
      ['LEGAL_FORM', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES', 'PAYMENT_MODE']
    );
    /******************************** ACTIVITY CODE *******************************/
    this.statusList.next(this.utilsService.refData['CONTRACT_STATUS']);
    this.legalList.next(this.utilsService.refData['LEGAL_FORM']);
    this.genderList.next(this.utilsService.refData['GENDER']);
    this.profileTitleList.next(this.utilsService.refData['PROF_TITLES']);
    this.paymentModeList.next(this.utilsService.refData['PAYMENT_MODE']);
    /************************************ USER ************************************/
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
          this.companyTaxList.next(
            companyTax.map(
              (obj) => {
                return { value: obj.companyTaxKey.tax_code, viewValue: obj.tax_desc};
          }
          )
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**************************************************************************
   * @description Create New Contractor
   * get application_id, company_id from userInfo
   * auto generate contractor code
   * get data from Forms
   *************************************************************************/
  async addNewContractor(data: FormGroup) {
    let filename = null;
    if (this.photo) {
      filename = await this.uploadService.uploadImage(this.photo)
        .pipe(
          map(
            response => response.file.filename
          ))
        .toPromise();
    }

    const newContractor = this.contractorForm.value;
    /*** CONTRACTOR KEY ***/
    newContractor.application_id = this.userInfo.company[0].companyKey.application_id;
    newContractor.email_address = this.userInfo.company[0].companyKey.email_address;
    newContractor.contractor_code = `${Math.random().toString(36).substring(7).toUpperCase()}`;
    newContractor.contractor_type = this.type;
    /*** PERSONAL INFORMATION ***/
    newContractor.contractor_name = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].socialReason.value;
    newContractor.registry_code = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].registryNumber.value;
    newContractor.language = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].language.value;
    newContractor.photo = filename ? filename : '';
    /*** ADDRESS ***/
    newContractor.address = this.contractorForm.controls.ADDRESS['controls'].address.value;
    newContractor.country_cd = this.contractorForm.controls.ADDRESS['controls'].registryCountryCtrl.value;
    newContractor.zip_code = this.contractorForm.controls.ADDRESS['controls'].zipCode.value;
    newContractor.city = this.contractorForm.controls.ADDRESS['controls'].city.value;
    /*** GENERAL CONTACT ***/
    newContractor.web_site = this.contractorForm.controls.GENERAL_CONTACT['controls'].webSite.value;
    newContractor.contact_email = this.contractorForm.controls.GENERAL_CONTACT['controls'].email.value;
    newContractor.phone_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phoneOne.value;
    newContractor.phone2_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phoneTwo.value;
    newContractor.fax_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].fax.value;
    /*** ORGANISATION ***/
    newContractor.activity_sector = this.contractorForm.controls.ORGANISATION['controls'].activitySector.value;
    newContractor.payment_cd = this.contractorForm.controls.ORGANISATION['controls'].paymentMode.value;
    newContractor.currency_cd = this.contractorForm.controls.ORGANISATION['controls'].currency.value;
    newContractor.vat_nbr = this.contractorForm.controls.ORGANISATION['controls'].vatNumber.value;
    newContractor.legal_form = this.contractorForm.controls.ORGANISATION['controls'].legalForm.value;
    newContractor.taxe_cd = this.contractorForm.controls.ORGANISATION['controls'].companyTax.value;
    /*** CONTACT ***/
    newContractor.first_name = this.contractorForm.controls.CONTACT['controls'].contactFirstname.value;
    newContractor.last_name = this.contractorForm.controls.CONTACT['controls'].contactLastname.value;
    newContractor.main_contact = this.contractorForm.controls.CONTACT['controls'].mainContact.value;
    newContractor.contact_email = this.contractorForm.controls.CONTACT['controls'].contactEmail.value;
    newContractor.gender_cd = this.contractorForm.controls.CONTACT['controls'].contactGender.value;
    newContractor.title_cd = this.contractorForm.controls.CONTACT['controls'].contactTitle.value;
    newContractor.phone_nbr = this.contractorForm.controls.CONTACT['controls'].contactPhone.value;
    newContractor.cell_phone_nbr = this.contractorForm.controls.CONTACT['controls'].contactCellphone.value;
    newContractor.language_cd = this.contractorForm.controls.CONTACT['controls'].contactLanguage.value;
    newContractor.can_sign_contract = this.contractorForm.controls.CONTACT['controls'].canSign.value;
    /*** AUTO FILL ***/
    newContractor.update_date = Date.now();
    newContractor.creation_date = Date.now();

    if (this.canUpdate(this.contractorId)) {
      const updatedC = this.contractorForm.value;
      /*** CONTRACTOR KEY ***/
      updatedC.application_id = this.contractorInfo.contractorKey.application_id;
      updatedC.email_address = this.contractorInfo.contractorKey.email_address;
      updatedC.contractor_code = this.contractorInfo.contractorKey.contractor_code;
      updatedC.contractor_type = this.contractorInfo.contractorKey.contractor_type;
      /*** PERSONAL INFORMATION ***/
      updatedC.contractor_name = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].socialReason.value;
      updatedC.registry_code = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].registryNumber.value;
      updatedC.language = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].language.value;
      updatedC.photo = filename ? filename : this.contractorInfo.photo;
      /*** ADDRESS ***/
      updatedC.address = this.contractorForm.controls.ADDRESS['controls'].address.value;
      updatedC.country_cd = this.contractorForm.controls.ADDRESS['controls'].registryCountryCtrl.value;
      updatedC.zip_code = this.contractorForm.controls.ADDRESS['controls'].zipCode.value;
      updatedC.city = this.contractorForm.controls.ADDRESS['controls'].city.value;
      /*** GENERAL CONTACT ***/
      updatedC.web_site = this.contractorForm.controls.GENERAL_CONTACT['controls'].webSite.value;
      updatedC.contact_email = this.contractorForm.controls.GENERAL_CONTACT['controls'].email.value;
      updatedC.phone_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phoneOne.value;
      updatedC.phone2_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phoneTwo.value;
      updatedC.fax_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].fax.value;
      /*** ORGANISATION ***/
      updatedC.activity_sector = this.contractorForm.controls.ORGANISATION['controls'].activitySector.value;
      updatedC.payment_cd = this.contractorForm.controls.ORGANISATION['controls'].paymentMode.value;
      updatedC.currency_cd = this.contractorForm.controls.ORGANISATION['controls'].currency.value;
      updatedC.vat_nbr = this.contractorForm.controls.ORGANISATION['controls'].vatNumber.value;
      updatedC.legal_form = this.contractorForm.controls.ORGANISATION['controls'].legalForm.value;
      updatedC.taxe_cd = this.contractorForm.controls.ORGANISATION['controls'].companyTax.value;
      /*** CONTACT ***/
      updatedC.first_name = this.contractorForm.controls.CONTACT['controls'].contactFirstname.value;
      updatedC.last_name = this.contractorForm.controls.CONTACT['controls'].contactLastname.value;
      updatedC.main_contact = this.contractorForm.controls.CONTACT['controls'].mainContact.value;
      updatedC.contact_email = this.contractorForm.controls.CONTACT['controls'].contactEmail.value;
      updatedC.gender_cd = this.contractorForm.controls.CONTACT['controls'].contactGender.value;
      updatedC.title_cd = this.contractorForm.controls.CONTACT['controls'].contactTitle.value;
      updatedC.phone_nbr = this.contractorForm.controls.CONTACT['controls'].contactPhone.value;
      updatedC.cell_phone_nbr = this.contractorForm.controls.CONTACT['controls'].contactCellphone.value;
      updatedC.language_cd = this.contractorForm.controls.CONTACT['controls'].contactLanguage.value;
      updatedC.can_sign_contract = this.contractorForm.controls.CONTACT['controls'].canSign.value;
      /*** AUTO FILL ***/
      updatedC.update_date = Date.now();

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
    this.photo = null;
  }

  /**************************************************************************
   * @description Get Contractor to be updated
   *************************************************************************/
  getContractorByID(params) {
    this.isLoading.next(true);
    forkJoin([
      this.contractorService.getContractors(`?_id=${atob(params.id)}`),
      this.contractorService.getContractorsContact(`?contractor_code=${atob(params.cc)}&email_address=${atob(params.ea)}`)
    ])
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        async (res) => {
          this.contractorInfo = res[0][0];
          this.contractorContactInfo = res[1][0];
          this.haveImage.next(res[0][0]['photo']);
          const av = await this.uploadService.getImage(res[0][0]['photo']);
          this.avatar.next(av);
          this.updateForms(this.contractorInfo, this.contractorContactInfo);
          this.isLoading.next(false);

        },
        (error) => {
          console.log(error);
        }
      );
  }

  getFile(obj: FormData) {
    this.photo = obj;
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
