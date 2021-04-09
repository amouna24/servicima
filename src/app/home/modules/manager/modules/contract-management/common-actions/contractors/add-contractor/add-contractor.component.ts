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
import { RefdataService } from '@core/services/refdata/refdata.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

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
   * @description Variable used to destroy all subscriptions as
   * Subject
   * BehaviorSubject
   * Subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription;

  /**************************************************************************
   * @description new Data Declarations 'LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES'
   *************************************************************************/
  countriesList: IViewParam[] = [];
  contractorContactList = [];
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
  contactList: BehaviorSubject<any> = new BehaviorSubject<any>(this.contractorContactList);

  /**************************************************************************
   * @description Form Group
   *************************************************************************/
  contractorForm: FormGroup;

  /**************************************************************************
   * @description Declare the new ContractorId to be used on update
   *************************************************************************/
  contractorId: string;
    /**************************************************************************
   * @description Declare application id
   *************************************************************************/
  applicationId: string;
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
          formControlName: 'contractor_name',
        },
        {
          label: 'Registry number',
          placeholder: 'Registry number',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'registry_code',
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
          formControlName: 'country_cd',
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
          formControlName: 'zip_code',
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
          formControlName: 'web_site',
        },
        {
          label: 'Email',
          placeholder: 'Email',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'contact_email',
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
          formControlName: 'phone_nbr',
        },
        {
          label: 'Phone 2',
          placeholder: 'Phone 2',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'phone2_nbr',
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
          formControlName: 'fax_nbr',
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
          formControlName: 'activity_sector',
        },
        {
          label: 'Payment Mode',
          placeholder: 'Payment Mode',
          type: FieldsType.SELECT,
          selectFieldList: this.paymentModeList,
          formControlName: 'payment_cd',
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
          formControlName: 'currency_cd',
        },
        {
          label: 'VAT Number',
          placeholder: 'VAT Number',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'vat_nbr',
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
          formControlName: 'legal_form',
        },
        {
          label: 'Company Tax',
          placeholder: 'Company Tax',
          type: FieldsType.SELECT,
          selectFieldList: this.companyTaxList,
          formControlName: 'taxe_cd',
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.one_item_stretch,
      fields: [
        {
          type: FieldsType.DATA_TABLE,
          dataTable: {
            displayedColumns: ['rowItem', 'first_name', 'last_name', 'main_contact', 'title_cd', 'Actions'],
            columns: [
              { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
              { name: 'First Name', prop: 'first_name', type: InputType.TEXT},
              { name: 'Last Name', prop: 'last_name', type: InputType.TEXT},
              { name: 'Main Contact', prop: 'main_contact', type: InputType.TEXT},
              { name: 'Email', prop: 'contact_email', type: InputType.TEXT},
              { name: 'Gender', prop: 'gender_cd', type: InputType.TEXT},
              { name: 'Title', prop: 'title_cd', type: InputType.TEXT},
              { name: 'Phone', prop: 'phone_nbr', type: InputType.TEXT},
              { name: 'Cellphone', prop: 'cell_phone_nbr', type: InputType.TEXT},
              { name: 'Language', prop: 'language_cd', type: InputType.TEXT},
              { name: 'Can sign', prop: 'can_sign_contract', type: InputType.TEXT},
              { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
            dataSource: this.contactList
          }
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
          formControlName: 'first_name',
        },
        {
          label: 'Last name',
          placeholder: 'Last name',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'last_name',
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
          formControlName: 'main_contact',
        },
        {
          label: 'Email',
          placeholder: 'Email',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'contact_email',
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
          formControlName: 'gender_cd',
        },
        {
          label: 'Title',
          placeholder: 'Title',
          type: FieldsType.SELECT,
          selectFieldList: this.profileTitleList,
          formControlName: 'title_cd',
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
          formControlName: 'phone_nbr',
        },
        {
          label: 'Cellphone',
          placeholder: 'Cellphone',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'cell_phone_nbr',
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
          formControlName: 'language_cd'
        },
        {
          label: 'Signature',
          type: FieldsType.SLIDE_TOGGLE,
          formControlName: 'can_sign_contract'
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.one_item_at_right,
      fields: [
        {
          type: FieldsType.ADD_MORE,
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
    private refdataService: RefdataService,
    private localStorageService: LocalStorageService
  ) {
    this.initContractForm();
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
 async ngOnInit() {
    await this.getInitialData();
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
    if (this.type === 'CLIENT') {
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
        contractor_name: ['', Validators.required],
        registry_code: [],
        language: [''],
      }),
      ADDRESS: this.formBuilder.group({
        address: [''],
        country_cd: [''],
        registryCountryFilterCtrl: [''],
        zip_code: [''],
        city: [''],
      }),
      GENERAL_CONTACT: this.formBuilder.group({
        web_site: [''],
        contact_email: ['', [Validators.required, Validators.email]],
        phone_nbr: [''],
        phone2_nbr: [''],
        fax_nbr: [''],
      }),
      ORGANISATION: this.formBuilder.group({
        activity_sector: [''],
        payment_cd: [''],
        currency_cd: [''],
        vat_nbr: [''],
        legal_form: [''],
        taxe_cd: [''],
      }),
      CONTACT: this.formBuilder.group({
        first_name: [''],
        last_name: [''],
        main_contact: ['', Validators.email],
        contact_email: ['', [Validators.required, Validators.email]],
        gender_cd: [''],
        title_cd: [''],
        phone_nbr: [''],
        cell_phone_nbr: [''],
        language_cd: [''],
        can_sign_contract: [''],
      }),
    });
  }

  updateForms(contractor: IContractor, contractorContact: IContractorContact) {
    this.contractorForm.patchValue({
      PERSONAL_INFORMATION : {
        contractor_name: contractor.contractor_name,
        registry_code: contractor.registry_code,
        language: contractor.language,
      },
      ADDRESS: {
        address: contractor.address,
        country_cd: contractor.country_cd,
        registryCountryFilterCtrl: '',
        zip_code: contractor.zip_code,
        city: contractor.city,
      },
      GENERAL_CONTACT: {
        web_site: contractor.web_site,
        contact_email: contractor.contact_email,
        phone_nbr: contractor.phone_nbr,
        phone2_nbr: contractor.phone2_nbr,
        fax_nbr: contractor.fax_nbr,
      },
      ORGANISATION: {
        activity_sector: contractor.activity_sector,
        payment_cd: contractor.payment_cd,
        currency_cd: contractor.currency_cd,
        vat_nbr: contractor.vat_nbr,
        legal_form: contractor.legal_form,
        taxe_cd: contractor.taxe_cd,
      },
      CONTACT: {
        first_name: contractorContact.first_name,
        last_name: contractorContact.last_name,
        main_contact:  contractorContact.main_contact,
        contact_email: contractorContact.contractorContactKey.contact_email,
        gender_cd: contractorContact.gender_cd,
        title_cd: contractorContact.title_cd,
        phone_nbr: contractorContact.phone_nbr,
        cell_phone_nbr: contractorContact.cell_phone_nbr,
        language_cd: contractorContact.language_cd,
        can_sign_contract: contractorContact.can_sign_contract,
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
 async getInitialData() {
  const cred = this.localStorageService.getItem('userCredentials');
  this.applicationId = cred['application_id'];
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
    /************************************ USER ************************************/
    this.subscriptions = this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.userInfo = data;
        this.companyEmail = data.user[0]['company_email'];
        this.getCompanyTax();
      }
    });
    /********************************** REF DATA **********************************/
   await this.refdataService.getRefData(
      this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
      this.applicationId,
      ['LEGAL_FORM', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES', 'PAYMENT_MODE']
    );
    /******************************** ACTIVITY CODE *******************************/
    this.statusList.next(this.refdataService.refData['CONTRACT_STATUS']);
    this.legalList.next(this.refdataService.refData['LEGAL_FORM']);
    this.genderList.next(this.refdataService.refData['GENDER']);
    this.profileTitleList.next(this.refdataService.refData['PROF_TITLES']);
    this.paymentModeList.next(this.refdataService.refData['PAYMENT_MODE']);
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
          this.contractorContactList = this.contractorInfo.contractor_contacts;
          this.contactList.next(this.contractorContactList.slice());
          this.isLoading.next(false);

        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**************************************************************************
   * @description Check if URL contains the ID og
   * @param _id String
   * @return true or false
   *************************************************************************/
  canUpdate(_id: any): boolean {
    return _id && _id !== '';
  }

  /***-----------------DYNAMIC COMPONENT INTERACTIONS -------------------***/

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
    newContractor.contractor_name = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].contractor_name.value;
    newContractor.registry_code = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].registry_code.value;
    newContractor.language = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].language.value;
    newContractor.photo = filename ? filename : '';
    /*** ADDRESS ***/
    newContractor.address = this.contractorForm.controls.ADDRESS['controls'].address.value;
    newContractor.country_cd = this.contractorForm.controls.ADDRESS['controls'].country_cd.value;
    newContractor.zip_code = this.contractorForm.controls.ADDRESS['controls'].zip_code.value;
    newContractor.city = this.contractorForm.controls.ADDRESS['controls'].city.value;
    /*** GENERAL CONTACT ***/
    newContractor.web_site = this.contractorForm.controls.GENERAL_CONTACT['controls'].web_site.value;
    newContractor.contact_email = this.contractorForm.controls.GENERAL_CONTACT['controls'].contact_email.value;
    newContractor.phone_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone_nbr.value;
    newContractor.phone2_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone2_nbr.value;
    newContractor.fax_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].fax_nbr.value;
    /*** ORGANISATION ***/
    newContractor.activity_sector = this.contractorForm.controls.ORGANISATION['controls'].activity_sector.value;
    newContractor.payment_cd = this.contractorForm.controls.ORGANISATION['controls'].payment_cd.value;
    newContractor.currency_cd = this.contractorForm.controls.ORGANISATION['controls'].currency_cd.value;
    newContractor.vat_nbr = this.contractorForm.controls.ORGANISATION['controls'].vat_nbr.value;
    newContractor.legal_form = this.contractorForm.controls.ORGANISATION['controls'].legal_form.value;
    newContractor.taxe_cd = this.contractorForm.controls.ORGANISATION['controls'].taxe_cd.value;
    /*** CONTACT ***/
    newContractor.first_name = this.contractorForm.controls.CONTACT['controls'].first_name.value;
    newContractor.last_name = this.contractorForm.controls.CONTACT['controls'].last_name.value;
    newContractor.main_contact = this.contractorForm.controls.CONTACT['controls'].main_contact.value;
    newContractor.contact_email = this.contractorForm.controls.CONTACT['controls'].contact_email.value;
    newContractor.gender_cd = this.contractorForm.controls.CONTACT['controls'].gender_cd.value;
    newContractor.title_cd = this.contractorForm.controls.CONTACT['controls'].title_cd.value;
    newContractor.phone_nbr = this.contractorForm.controls.CONTACT['controls'].phone_nbr.value;
    newContractor.cell_phone_nbr = this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value;
    newContractor.language_cd = this.contractorForm.controls.CONTACT['controls'].language_cd.value;
    newContractor.can_sign_contract = this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value;
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
      updatedC.contractor_name = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].contractor_name.value;
      updatedC.registry_code = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].registry_code.value;
      updatedC.language = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].language.value;
      updatedC.photo = filename ? filename : this.contractorInfo.photo;
      /*** ADDRESS ***/
      updatedC.address = this.contractorForm.controls.ADDRESS['controls'].address.value;
      updatedC.country_cd = this.contractorForm.controls.ADDRESS['controls'].country_cd.value;
      updatedC.zip_code = this.contractorForm.controls.ADDRESS['controls'].zip_code.value;
      updatedC.city = this.contractorForm.controls.ADDRESS['controls'].city.value;
      /*** GENERAL CONTACT ***/
      updatedC.web_site = this.contractorForm.controls.GENERAL_CONTACT['controls'].web_site.value;
      updatedC.contact_email = this.contractorForm.controls.GENERAL_CONTACT['controls'].contact_email.value;
      updatedC.phone_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone_nbr.value;
      updatedC.phone2_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone2_nbr.value;
      updatedC.fax_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].fax_nbr.value;
      /*** ORGANISATION ***/
      updatedC.activity_sector = this.contractorForm.controls.ORGANISATION['controls'].activity_sector.value;
      updatedC.payment_cd = this.contractorForm.controls.ORGANISATION['controls'].payment_cd.value;
      updatedC.currency_cd = this.contractorForm.controls.ORGANISATION['controls'].currency_cd.value;
      updatedC.vat_nbr = this.contractorForm.controls.ORGANISATION['controls'].vat_nbr.value;
      updatedC.legal_form = this.contractorForm.controls.ORGANISATION['controls'].legal_form.value;
      updatedC.taxe_cd = this.contractorForm.controls.ORGANISATION['controls'].taxe_cd.value;
      /*** CONTACT ***/
      updatedC.first_name = this.contractorForm.controls.CONTACT['controls'].first_name.value;
      updatedC.last_name = this.contractorForm.controls.CONTACT['controls'].last_name.value;
      updatedC.main_contact = this.contractorForm.controls.CONTACT['controls'].main_contact.value;
      updatedC.contact_email = this.contractorForm.controls.CONTACT['controls'].contact_email.value;
      updatedC.gender_cd = this.contractorForm.controls.CONTACT['controls'].gender_cd.value;
      updatedC.title_cd = this.contractorForm.controls.CONTACT['controls'].title_cd.value;
      updatedC.phone_nbr = this.contractorForm.controls.CONTACT['controls'].phone_nbr.value;
      updatedC.cell_phone_nbr = this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value;
      updatedC.language_cd = this.contractorForm.controls.CONTACT['controls'].language_cd.value;
      updatedC.can_sign_contract = this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value;
      /*** AUTO FILL ***/
      updatedC.update_date = Date.now();

      this.contractorService.updateContractor(updatedC)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (res) => {
            updatedC.contractor_id = res._id;
            this.contractorContactList.forEach(
              (contact) => {
                contact.contractor_id = res._id;
                contact.application_id = updatedC.application_id;
                contact.email_address = updatedC.email_address;
                contact.contractor_code = updatedC.contractor_code;
                contact.contractor_type = updatedC.contractor_type;
                if (contact._id) {
                  this.contractorService.updateContractorContact(updatedC)
                    .pipe(
                      takeUntil(this.destroy$)
                    )
                    .subscribe(
                      (response) => {
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
                } else {
                  this.contractorService.addContractorContact(contact)
                    .pipe(
                      takeUntil(
                        this.destroy$
                      )
                    )
                    .subscribe(
                      (resp) => {
                      }, error => console.log('error', error)
                    );
                }
                if (this.type === 'CLIENT') {
                  this.router.navigate(
                    ['/manager/contract-management/clients-contracts/clients-list']);
                } else if (this.type === 'SUPPLIER') {
                  this.router.navigate(
                    ['/manager/contract-management/suppliers-contracts/suppliers-list']);
                }
              }
            );

          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.contractorService.addContractor(newContractor)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            newContractor.contractor_id = response.Contractor._id;
            this.contractorContactList.forEach(
              (contact) => {
                contact.contractor_id = response.Contractor._id;
                contact.application_id = newContractor.application_id;
                contact.email_address = newContractor.email_address;
                contact.contractor_code = newContractor.contractor_code;
                contact.contractor_type = newContractor.contractor_type;
                this.contractorService.addContractorContact(contact)
                  .pipe(
                    takeUntil(
                      this.destroy$
                    )
                  )
                  .subscribe(
                    (res) => {
                    },
                    error => console.log('error', error)
                  );
              }
            );
            if (this.type === 'CLIENT') {
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
   * @description Create/Update New/Old Contractor Contact
   * @param result
   * result.action: ['update', addMode]
   *************************************************************************/
  addContractorContact(result) {
    switch (result.action) {
      case 'update': {
        this.contractorContactList.forEach(
          (element, index) => {
            if ( (element.contractorContactKey ? element.contractorContactKey.contact_email  : element.contact_email  ) ===
              this.contractorForm.controls.CONTACT['controls'].contact_email.value) {
              this.contractorContactList[index].first_name = this.contractorForm.controls.CONTACT['controls'].first_name.value;
              this.contractorContactList[index].last_name = this.contractorForm.controls.CONTACT['controls'].last_name.value;
              this.contractorContactList[index].main_contact = this.contractorForm.controls.CONTACT['controls'].main_contact.value;
              this.contractorContactList[index].contact_email = this.contractorForm.controls.CONTACT['controls'].contact_email.value;
              this.contractorContactList[index].gender_cd = this.contractorForm.controls.CONTACT['controls'].gender_cd.value;
              this.contractorContactList[index].title_cd = this.contractorForm.controls.CONTACT['controls'].title_cd.value;
              this.contractorContactList[index].phone_nbr = this.contractorForm.controls.CONTACT['controls'].phone_nbr.value;
              this.contractorContactList[index].cell_phone_nbr = this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value;
              this.contractorContactList[index].language_cd = this.contractorForm.controls.CONTACT['controls'].language_cd.value;
              this.contractorContactList[index].can_sign_contract = this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value;
            }
          }
        );
      }
        break;
      case 'addMore': {
        this.contactList.next([]);
        this.contractorContactList.push(
          {
            first_name: this.contractorForm.controls.CONTACT['controls'].first_name.value,
            last_name: this.contractorForm.controls.CONTACT['controls'].last_name.value,
            main_contact: this.contractorForm.controls.CONTACT['controls'].main_contact.value,
            contact_email: this.contractorForm.controls.CONTACT['controls'].contact_email.value,
            gender_cd: this.contractorForm.controls.CONTACT['controls'].gender_cd.value,
            title_cd: this.contractorForm.controls.CONTACT['controls'].title_cd.value,
            phone_nbr: this.contractorForm.controls.CONTACT['controls'].phone_nbr.value,
            cell_phone_nbr: this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value,
            language_cd: this.contractorForm.controls.CONTACT['controls'].language_cd.value,
            can_sign_contract: this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value,
          }
        );
        this.contactList.next(this.contractorContactList.slice());
      }
    }

  }

  /**************************************************************************
   * @description get the selected Image From Dynamic Component
   * @param obj FormData
   *************************************************************************/
  getFile(obj: FormData) {
    this.photo = obj;
  }

  /**************************************************************************
   * @description get selected Action From Dynamic Component
   * @param rowAction Object { data, rowAction }
   * data _id
   * rowAction [show, update, delete]
   *************************************************************************/
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): // this.showContact(rowAction.data);
        break;
      case ('update'): this.setContractorContact(rowAction.data);
        break;
      case('delete'): // this.onStatusChange(rowAction.data);
    }
  }

  /**************************************************************************
   * @description get rowData
   * update form with row details
   *************************************************************************/
  setContractorContact(row) {
    this.contractorForm.controls.CONTACT['controls'].first_name.setValue(row.first_name);
    this.contractorForm.controls.CONTACT['controls'].last_name.setValue(row.last_name);
    this.contractorForm.controls.CONTACT['controls'].main_contact.setValue(row.main_contact);
    this.contractorForm.controls.CONTACT['controls'].contact_email.setValue(
      row.contractorContactKey ? row.contractorContactKey.contact_email : row.contact_email
    );
    this.contractorForm.controls.CONTACT['controls'].gender_cd.setValue(row.gender_cd);
    this.contractorForm.controls.CONTACT['controls'].title_cd.setValue(row.title_cd);
    this.contractorForm.controls.CONTACT['controls'].phone_nbr.setValue(row.phone_nbr);
    this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.setValue(row.cell_phone_nbr);
    this.contractorForm.controls.CONTACT['controls'].language_cd.setValue(row.language_cd);
    this.contractorForm.controls.CONTACT['controls'].can_sign_contract.setValue(row.can_sign_contract);
  }
  /***-------------- END OF DYNAMIC COMPONENT INTERACTIONS --------------***/

  /**************************************************************************
   * @description Destroy All subscriptions declared with
   * takeUntil operator
   * Subscription
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.subscriptions.unsubscribe();
  }
}
