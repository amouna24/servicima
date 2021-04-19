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
import {
  FieldsAlignment,
  FieldsType,
  IDynamicForm,
  IFieldsObject,
  InputType
} from '@shared/models/dynamic-component/form.model';
import { userType } from '@shared/models/userProfileType.model';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from '@core/services/modal/modal.service';

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
  private subscriptionModal: Subscription;

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserInfo;
  contractorInfo: IContractor;
  contractorContactInfo = [];
  companyEmail: string;
  activitySectorField: BehaviorSubject<IFieldsObject> = new BehaviorSubject<IFieldsObject>({
    label: 'Activity Sector',
    placeholder: 'Activity Sector',
    type: FieldsType.INPUT,
    inputType: InputType.TEXT,
    formControlName: 'activity_sector',
  });
  /**************************************************************************
   * @description new Data Declarations 'LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES'
   *************************************************************************/
  countriesList: IViewParam[] = [];
  activitySectorList: IViewParam[] = [];
  filteredCountries: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  activityCodeList: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  langList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  citiesList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  genderList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  legalList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  profileTitleList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  currencyList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  statusList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  paymentModeList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  companyTaxList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  contactList: BehaviorSubject<any> = new BehaviorSubject<any>(this.contractorContactInfo);
  canUpdateAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  /**************************************************************************
   * @description Form Group
   *************************************************************************/
  contractorForm: FormGroup;

  /**************************************************************************
   * @description Declare the new ContractorId to be used on update
   *************************************************************************/
  contractorId: string;
  contractorFilter: { cc: string, ea: string };
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
  dynamicForm: BehaviorSubject<IDynamicForm[] > = new BehaviorSubject<IDynamicForm[]>([
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
        this.activitySectorField.getValue(),
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
          formControlName: 'tax_cd',
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
          type: FieldsType.ADD_MORE_OR_UPDATE,
          canUpdate: this.canUpdateAction,
          canAdd: this.canAddAction,
        },
      ],
    },
  ]);

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
    private modalServices: ModalService,
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
          this.contractorFilter = { cc: params.cc, ea: params.ea };
          this.getContractorByID(params);
        }
      });
    if (this.type === 'CLIENT') {
      this.backURL = '/manager/contract-management/clients-contracts/clients-list';
    } else if (this.type === 'SUPPLIER') {
      this.backURL = '/manager/contract-management/suppliers-contracts/suppliers-list';
    }
    this.contractorForm.get('ADDRESS').valueChanges.subscribe(selectedValue => {
      selectedValue.country_cd === 'FRA' ?
        this.dynamicForm.getValue()[7].fields[0] = {
          label: 'Activity Sector',
          placeholder: 'Activity Sector',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.activityCodeList,
          formControlName: 'activity_sector',
          searchControlName: 'activitySectorFilterCtrl'
        } :
        this.dynamicForm.getValue()[7].fields[0] = {
          label: 'Activity Sector',
          placeholder: 'Activity Sector',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'activity_sector',
        };
      console.log(this.activitySectorField.getValue());
      console.log(selectedValue.country_cd);
    });
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
        activitySectorFilterCtrl: [''],
        payment_cd: [''],
        currency_cd: [''],
        vat_nbr: [''],
        legal_form: [''],
        tax_cd: [''],
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
        activitySectorFilterCtrl: '',
        payment_cd: contractor.payment_cd,
        currency_cd: contractor.currency_cd,
        vat_nbr: contractor.vat_nbr,
        legal_form: contractor.legal_form,
        tax_cd: contractor.tax_cd,
      },
      CONTACT: {
        first_name: '',
        last_name: '',
        main_contact:  '',
        contact_email: '',
        gender_cd: '',
        title_cd: '',
        phone_nbr: '',
        cell_phone_nbr: '',
        language_cd: '',
        can_sign_contract: '',
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
    /************************************ USER ************************************/
    this.subscriptions = this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.userInfo = data;
        this.companyEmail = data.user[0]['company_email'];
        this.getCompanyTax();
      }
    });
    /********************************** COUNTRY **********************************/
    this.utilsService.getCountry(this.utilsService.getCodeLanguage(this.userInfo['user'][0]['language_id'])).map((country) => {
      this.countriesList.push({ value: country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC });
    });
    /***************************** FILTERED COUNTRY *******************************/
    this.filteredCountries.next(this.countriesList.slice());
    this.utilsService.changeValueField(
      this.countriesList,
      this.contractorForm.controls.ADDRESS['controls'].registryCountryFilterCtrl,
      this.filteredCountries
    );
    /********************************** ACTIVITY CODE **********************************/
    this.appInitializerService.activityCodeList.forEach((activityCode) => {
      this.activitySectorList.push({
        value: activityCode.NAF,
        viewValue: `${activityCode.NAF} - ${activityCode.ACTIVITE}`
      });
    });
    /******************************** FILTERED ACTIVITY CODE *******************************/
    this.activityCodeList.next(this.activitySectorList.slice());
    this.utilsService.changeValueField(
      this.activitySectorList,
      this.contractorForm.controls.ORGANISATION['controls'].activitySectorFilterCtrl,
      this.activityCodeList
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
          this.contractorContactInfo = res[1];
          this.haveImage.next(res[0][0]['photo']);
          const av = await this.uploadService.getImage(res[0][0]['photo']);
          this.avatar.next(av);
          this.updateForms(this.contractorInfo, this.contractorContactInfo[0]);
          this.contractorContactInfo.map(
            (contact) => {
              contact.title_cd = this.utilsService.refData['PROF_TITLES'].find((type) =>
                type.value === contact.title_cd).viewValue;
            }
          );
          this.contactList.next(this.contractorContactInfo.slice()
          );
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

    const Contractor: IContractor = {
      activity_sector: '',
      address: '',
      application_id: '',
      city: '',
      contact_email: '',
      contractor_code: '',
      contractor_name: '',
      contractor_type: '',
      currency_cd: '',
      email_address: '',
      fax_nbr: '',
      language: '',
      payment_cd: '',
      phone2_nbr: '',
      phone_nbr: '',
      photo: '',
      registry_code: '',
      status: '',
      tax_cd: '',
      vat_nbr: '',
      web_site: '',
      zip_code: '',
    };
    if (this.canUpdate(this.contractorId)) {
      /*** CONTRACTOR KEY ***/
      Contractor.application_id = this.contractorInfo.contractorKey.application_id;
      Contractor.email_address = this.contractorInfo.contractorKey.email_address;
      Contractor.contractor_code = this.contractorInfo.contractorKey.contractor_code;
      Contractor.contractor_type = this.contractorInfo.contractorKey.contractor_type;
      /*** PERSONAL INFORMATION ***/
      Contractor.contractor_name = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].contractor_name.value;
      Contractor.registry_code = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].registry_code.value;
      Contractor.language = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].language.value;
      Contractor.photo = filename ? filename : this.contractorInfo.photo;
      /*** ADDRESS ***/
      Contractor.address = this.contractorForm.controls.ADDRESS['controls'].address.value;
      Contractor.country_cd = this.contractorForm.controls.ADDRESS['controls'].country_cd.value;
      Contractor.zip_code = this.contractorForm.controls.ADDRESS['controls'].zip_code.value;
      Contractor.city = this.contractorForm.controls.ADDRESS['controls'].city.value;
      /*** GENERAL CONTACT ***/
      Contractor.web_site = this.contractorForm.controls.GENERAL_CONTACT['controls'].web_site.value;
      Contractor.contact_email = this.contractorForm.controls.GENERAL_CONTACT['controls'].contact_email.value;
      Contractor.phone_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone_nbr.value;
      Contractor.phone2_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone2_nbr.value;
      Contractor.fax_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].fax_nbr.value;
      /*** ORGANISATION ***/
      Contractor.activity_sector = this.contractorForm.controls.ORGANISATION['controls'].activity_sector.value;
      Contractor.payment_cd = this.contractorForm.controls.ORGANISATION['controls'].payment_cd.value;
      Contractor.currency_cd = this.contractorForm.controls.ORGANISATION['controls'].currency_cd.value;
      Contractor.vat_nbr = this.contractorForm.controls.ORGANISATION['controls'].vat_nbr.value;
      Contractor.legal_form = this.contractorForm.controls.ORGANISATION['controls'].legal_form.value;
      Contractor.tax_cd = this.contractorForm.controls.ORGANISATION['controls'].tax_cd.value;
      Contractor.update_date = Date.now();
      Contractor.creation_date = this.contractorInfo.creation_date;

      this.contractorService.updateContractor(Contractor)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (res) => {
            console.log('res', res);

          },
          (error) => {
            console.log(error);
          }
        );
      this.contractorContactInfo.forEach(
        (contact) => {
          console.log('Contractor', Contractor);
          contact.application_id = Contractor.application_id;
          contact.email_address = Contractor.email_address;
          contact.contractor_code = Contractor.contractor_code;
          contact.title_cd = this.utilsService.refData['PROF_TITLES'].find((type) =>
                type.viewValue === contact.title_cd).value;
          if (contact._id && contact?.updated) {
            this.contractorService.updateContractorContact(contact)
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(
                (response) => {
                  console.log('response', response);
                },
                (error) => {
                  console.log('error', error);
                },
                () => {
                  if (this.type === 'CLIENT') {
                    this.router.navigate(
                      ['/manager/contract-management/clients-contracts/clients-list']);
                  } else if (this.type === 'SUPPLIER') {
                    this.router.navigate(
                      ['/manager/contract-management/suppliers-contracts/suppliers-list']);
                  }
                }
              );
          } else if (!contact?._id) {
            this.contractorService.addContractorContact(contact)
              .pipe(
                takeUntil(
                  this.destroy$
                )
              )
              .subscribe(
                (resp) => {
                  console.log('resp', resp);
                },
                error => {
                  console.log('error', error);
                },
                () => {
                  if (this.type === 'CLIENT') {
                    this.router.navigate(
                      ['/manager/contract-management/clients-contracts/clients-list']);
                  } else if (this.type === 'SUPPLIER') {
                    this.router.navigate(
                      ['/manager/contract-management/suppliers-contracts/suppliers-list']);
                  }
                }
              );
          }
        }
      );
    } else {
      /*** CONTRACTOR KEY ***/
      Contractor.application_id = this.userInfo.company[0].companyKey.application_id;
      Contractor.email_address = this.userInfo.company[0].companyKey.email_address;
      Contractor.contractor_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-CR`;
      Contractor.contractor_type = this.type;
      /*** PERSONAL INFORMATION ***/
      Contractor.contractor_name = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].contractor_name.value;
      Contractor.registry_code = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].registry_code.value;
      Contractor.language = this.contractorForm.controls.PERSONAL_INFORMATION['controls'].language.value;
      Contractor.photo = filename ? filename : '';
      /*** ADDRESS ***/
      Contractor.address = this.contractorForm.controls.ADDRESS['controls'].address.value;
      Contractor.country_cd = this.contractorForm.controls.ADDRESS['controls'].country_cd.value;
      Contractor.zip_code = this.contractorForm.controls.ADDRESS['controls'].zip_code.value;
      Contractor.city = this.contractorForm.controls.ADDRESS['controls'].city.value;
      /*** GENERAL CONTACT ***/
      Contractor.web_site = this.contractorForm.controls.GENERAL_CONTACT['controls'].web_site.value;
      Contractor.contact_email = this.contractorForm.controls.GENERAL_CONTACT['controls'].contact_email.value;
      Contractor.phone_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone_nbr.value;
      Contractor.phone2_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].phone2_nbr.value;
      Contractor.fax_nbr = this.contractorForm.controls.GENERAL_CONTACT['controls'].fax_nbr.value;
      /*** ORGANISATION ***/
      Contractor.activity_sector = this.contractorForm.controls.ORGANISATION['controls'].activity_sector.value;
      Contractor.payment_cd = this.contractorForm.controls.ORGANISATION['controls'].payment_cd.value;
      Contractor.currency_cd = this.contractorForm.controls.ORGANISATION['controls'].currency_cd.value;
      Contractor.vat_nbr = this.contractorForm.controls.ORGANISATION['controls'].vat_nbr.value;
      Contractor.legal_form = this.contractorForm.controls.ORGANISATION['controls'].legal_form.value;
      Contractor.tax_cd = this.contractorForm.controls.ORGANISATION['controls'].tax_cd.value;

      Contractor.creation_date = Date.now();
      this.contractorService.addContractor(Contractor)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('response', response);
          },

          (error) => {
            console.log(error);
          }
        );
      this.contractorContactInfo.forEach(
        (contact) => {
          contact.application_id = Contractor.application_id;
          contact.email_address = Contractor.email_address;
          contact.contractor_code = Contractor.contractor_code;
          contact.title_cd = this.utilsService.refData['PROF_TITLES'].find((type) =>
            type.viewValue === contact.title_cd).value;
          this.contractorService.addContractorContact(contact)
            .pipe(
              takeUntil(
                this.destroy$
              )
            )
            .subscribe(
              (res) => {
              },
              error => {
                console.log('error', error);
              },
              () => {
                if (this.type === 'CLIENT') {
                  this.router.navigate(
                    ['/manager/contract-management/clients-contracts/clients-list']);
                } else if (this.type === 'SUPPLIER') {
                  this.router.navigate(
                    ['/manager/contract-management/suppliers-contracts/suppliers-list']);
                }
              }
            );
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
        this.contractorContactInfo.forEach(
          (element, index) => {
            if ( (element.contractorContactKey ? element.contractorContactKey.contact_email  : element.contact_email  ) ===
              this.contractorForm.controls.CONTACT['controls'].contact_email.value) {
              this.contractorContactInfo[index].first_name = this.contractorForm.controls.CONTACT['controls'].first_name.value;
              this.contractorContactInfo[index].last_name = this.contractorForm.controls.CONTACT['controls'].last_name.value;
              this.contractorContactInfo[index].main_contact = this.contractorForm.controls.CONTACT['controls'].main_contact.value;
              this.contractorContactInfo[index].contact_email = this.contractorForm.controls.CONTACT['controls'].contact_email.value;
              this.contractorContactInfo[index].gender_cd = this.contractorForm.controls.CONTACT['controls'].gender_cd.value;
              this.contractorContactInfo[index].title_cd = this.utilsService.refData['PROF_TITLES'].find((type) =>
                type.value === this.contractorForm.controls.CONTACT['controls'].title_cd.value).viewValue,
              this.contractorContactInfo[index].phone_nbr = this.contractorForm.controls.CONTACT['controls'].phone_nbr.value;
              this.contractorContactInfo[index].cell_phone_nbr = this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value;
              this.contractorContactInfo[index].language_cd = this.contractorForm.controls.CONTACT['controls'].language_cd.value;
              this.contractorContactInfo[index].can_sign_contract = this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value;
              this.contractorContactInfo[index].updated = true;
            }
          }
        );
        this.contractorForm.patchValue(
          {
            CONTACT: {
              first_name: '',
              last_name: '',
              main_contact: '',
              contact_email: '',
              gender_cd: '',
              title_cd: '',
              phone_nbr: '',
              cell_phone_nbr: '',
              language_cd: '',
              can_sign_contract: '',
            },
          }
        );
        this.canUpdateAction.next(false);
        this.canAddAction.next(true);
      }
        break;
      case 'addMore': {
        this.contactList.next([]);
        this.contractorContactInfo.push(
          {
            first_name: this.contractorForm.controls.CONTACT['controls'].first_name.value,
            last_name: this.contractorForm.controls.CONTACT['controls'].last_name.value,
            main_contact: this.contractorForm.controls.CONTACT['controls'].main_contact.value,
            contact_email: this.contractorForm.controls.CONTACT['controls'].contact_email.value,
            gender_cd: this.contractorForm.controls.CONTACT['controls'].gender_cd.value,
            title_cd:       this.utilsService.refData['PROF_TITLES'].find((type) =>
              type.value === this.contractorForm.controls.CONTACT['controls'].title_cd.value).viewValue,
            phone_nbr: this.contractorForm.controls.CONTACT['controls'].phone_nbr.value,
            cell_phone_nbr: this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value,
            language_cd: this.contractorForm.controls.CONTACT['controls'].language_cd.value,
            can_sign_contract: this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value,
          }
        );
        this.contactList.next(this.contractorContactInfo.slice());
        this.contractorForm.patchValue(
          {
            CONTACT: {
              first_name: '',
              last_name: '',
              main_contact: '',
              contact_email: '',
              gender_cd: '',
              title_cd: '',
              phone_nbr: '',
              cell_phone_nbr: '',
              language_cd: '',
              can_sign_contract: '',
            },
          }
        );
      }
      break;
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
   * @description: Function to call  Dialog
   * @return: Updated Contractor Status
   *************************************************************************/
  onStatusChange(Contact) {
    const confirmation = {
      code: 'delete',
      title: 'Are you sure ?',
      status: Contact['status']
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {
              this.contractorService.deleteContractorContact(Contact._id)
                .pipe(
                  takeUntil(this.destroy$)
                )
                .subscribe(
                  (res1) => {
                    this.contractorService.getContractorsContact(
                      `?contractor_code=${atob(this.contractorFilter.cc)}&email_address=${atob(this.contractorFilter.ea)}`
                    );
                  }
                );
            this.subscriptionModal.unsubscribe();
          }
        }
      );
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
      case('delete'):  this.onStatusChange(rowAction.data);
    }
  }

  /**************************************************************************
   * @description get rowData
   * update form with row details
   *************************************************************************/
  setContractorContact(row) {
    this.contractorForm.controls.CONTACT['controls'].contact_email.disable();
    this.canAddAction.next(false);
    this.canUpdateAction.next(true);
    this.contractorForm.controls.CONTACT['controls'].first_name.setValue(row.first_name);
    this.contractorForm.controls.CONTACT['controls'].last_name.setValue(row.last_name);
    this.contractorForm.controls.CONTACT['controls'].main_contact.setValue(row.main_contact);
    this.contractorForm.controls.CONTACT['controls'].contact_email.setValue(
      row.contractorContactKey ? row.contractorContactKey.contact_email : row.contact_email
    );
    this.contractorForm.controls.CONTACT['controls'].gender_cd.setValue(row.gender_cd);
    this.contractorForm.controls.CONTACT['controls'].title_cd.setValue(
      this.utilsService.refData['PROF_TITLES'].find((type) =>
      type.viewValue === row.title_cd).value);
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
