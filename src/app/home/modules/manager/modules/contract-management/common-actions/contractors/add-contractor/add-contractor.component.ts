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
import { RefdataService } from '@core/services/refdata/refdata.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
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
  filteredGenders: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredTitles: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredCurrencies: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredPayMode: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredLegalForm: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
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
   * @description Declare application id
   *************************************************************************/
  applicationId: string;
  /**************************************************************************
   * @description User Image
   *************************************************************************/
  avatar: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  haveImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  photo: FormData;
  /**************************************************************************
   * @description Resume models List
   *************************************************************************/
  resumeModels: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([
    {
    icon: 'assets/img/peter-river-icon.jpg',
    viewValue: 'Default',
    value: 'DEFAULT',
  },
    {
      icon: 'assets/img/Emerald-icon.jpg',
      viewValue: 'Emerald',
      value: 'EMERALD',

    },
    {
      icon: 'assets/img/amethyst-icon.jpg',
      viewValue: 'Amethyst',
      value: 'AMETHYST',

    },
    {
      icon: 'assets/img/orange-icon.jpg',
      viewValue: 'Orange',
      value: 'ORANGE',
    },
    {
      icon: 'assets/img/sun-flower-icon.jpg',
      viewValue: 'Sun Flower',
      value: 'SUN_FLOWER',
    },
    {
      icon: 'assets/img/silver-icon.jpg',
      viewValue: 'Silver',
      value: 'SILVER',
    },
    {
      icon: 'assets/img/midnight-blue-icon.jpg',
      viewValue: 'Midnight Blue',
      value: 'MIDNIGHT_BLUE',
    },
    {
      icon: 'assets/img/Green-icon.jpg',
      viewValue: 'Green',
      value: 'GREEN',
    },
    {
      icon: 'assets/img/Alizarin-icon.jpg',
      viewValue: 'Alizarin',
      value: 'ALIZARIN',
    },
  ]);
  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  contractorItems: IDynamicMenu[] = [
    {
      title: 'resume-general-info',
      titleKey: 'GENERAL_INFORMATION',
      child: [
        {
          title: 'personal_information_all',
          titleKey: 'PERSONAL_INFORMATION',
        },
        {
          title: 'address_label_all',
          titleKey: 'ADDRESS',
        },
        {
          title: 'general_contact_all',
          titleKey: 'GENERAL_CONTACT',
        },
        {
          title: 'Organisation',
          titleKey: 'ORGANISATION',
        },
      ]
    },
    { title: 'resume_template_all',
      titleKey: 'RESUME_TEMPLATE',
      child: [],
    },
    {
      title: 'user.contact',
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
          label: 'contractor_name',
          placeholder: 'contractor_name',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'contractor_name',
        },
        {
          label: 'registre_nbr_all',
          placeholder: 'registre_nbr_all',
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
          label: 'rh_language_cerif_show',
          placeholder: 'rh_language_cerif_show',
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
          label: 'address_label_all',
          placeholder: 'address_label_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'address',
        },
        {
          label: 'country_all',
          placeholder: 'country_all',
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
          label: 'homecompany.city',
          placeholder: 'homecompany.city',
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
          label: 'rh_website_certif',
          placeholder: 'rh_website_certif',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'web_site',
        },
        {
          label: 'email_all',
          placeholder: 'email_all',
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
          label: 'phone_all',
          placeholder: 'phone_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'phone_nbr',
        },
        {
          label: 'phone_all',
          placeholder: 'phone_all',
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
          label: 'manager-setting-menu.payment.payment.method',
          placeholder: 'manager-setting-menu.payment.payment.method',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredPayMode,
          formControlName: 'payment_cd',
          searchControlName: 'filteredPayementOrganisation'
        },
      ],
    },
    {
      titleRef: 'ORGANISATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'currency_all',
          placeholder: 'currency_all',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCurrencies,
          formControlName: 'currency_cd',
          searchControlName: 'filteredCurrencyOrganisation'
        },
        {
          label: 'invoice.vatLine',
          placeholder: 'invoice.vatLine',
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
          label: 'homecompany.legalform',
          placeholder: 'homecompany.legalform',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredLegalForm,
          formControlName: 'legal_form',
          searchControlName: 'filteredLegalOrganisation'
        },
        {
          label: 'company_tax_all',
          placeholder: 'company_tax_all',
          type: FieldsType.SELECT,
          selectFieldList: this.companyTaxList,
          formControlName: 'tax_cd',
        },
      ],
    },
    {
      titleRef: 'RESUME_TEMPLATE',
      fieldsLayout: FieldsAlignment.one_item_at_center,
      fields: [
        {
          label: 'resume_template_all',
          type: FieldsType.THEME_RADIO_GROUP,
          selectFieldList: this.resumeModels,
          formControlName: 'resume_template',
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
          label: 'first_name_all',
          placeholder: 'first_name_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'first_name',
        },
        {
          label: 'last_name_all',
          placeholder: 'last_name_all',
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
          label: 'user.contact',
          placeholder: 'user.contact',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'main_contact',
        },
        {
          label: 'email_all',
          placeholder: 'email_all',
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
          label: 'gender_all',
          placeholder: 'gender_all',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredGenders,
          formControlName: 'gender_cd',
          searchControlName: 'filteredGenderContact'
        },
        {
          label: 'job_title_all',
          placeholder: 'job_title_all',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredTitles,
          formControlName: 'title_cd',
          searchControlName: 'filteredTitleContact'
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'phone_all',
          placeholder: 'phone_all',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'phone_nbr',
        },
        {
          label: 'cell_phone_all',
          placeholder: 'cell_phone_all',
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
          label: 'rh_language_cerif_show',
          placeholder: 'rh_language_cerif_show',
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
    private refDataService: RefdataService,
    private localStorageService: LocalStorageService
  ) {
    this.initContractForm();
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe( params => {
        if (params.id) {
          this.contractorId = params.id;
          this.contractorFilter = { cc: params.cc, ea: params.ea };
          this.getContractorByID(params);
        }
      });
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
 async ngOnInit() {
    await this.getInitialData();

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
    });
  }
  /**************************************************************************
   * @description Init Contract Form
   *************************************************************************/
  initContractForm() {
    this.contractorForm = this.formBuilder.group({
      PERSONAL_INFORMATION: this.formBuilder.group({
        contractor_name: ['', Validators.required],
        registry_code: [''],
        language: [''],
      }),
      ADDRESS: this.formBuilder.group({
        address: ['', Validators.required],
        country_cd: [''],
        registryCountryFilterCtrl: [''],
        zip_code: [''],
        city: [''],
      }),
      GENERAL_CONTACT: this.formBuilder.group({
        web_site: [''],
        contact_email: [''],
        phone_nbr: [''],
        phone2_nbr: [''],
        fax_nbr: ['', ],
      }),
      ORGANISATION: this.formBuilder.group({
        activity_sector: ['' ],
        activitySectorFilterCtrl: [''],
        payment_cd: [''],
        currency_cd: [''],
        filteredPayementOrganisation: [''],
        filteredLegalOrganisation: [''],
        filteredCurrencyOrganisation: [''],
        vat_nbr: [''],
        legal_form: [''],
        tax_cd: [''],
      }),
      RESUME_TEMPLATE: this.formBuilder.group( {
        resume_template: [''],
        update: true,
      }),
      CONTACT: this.formBuilder.group({
        first_name: [''],
        last_name: [''],
        main_contact: [''],
        contact_email: [''],
        gender_cd: [''],
        title_cd: [''],
        phone_nbr: [''],
        cell_phone_nbr: [''],
        filteredTitleContact: [''],
        filteredGenderContact: [''],
        registryCountryFilterCtrl: [''],
        language_cd: [''],
        can_sign_contract: [''],
      }),
    });
  }
  updateForms(contractor: IContractor) {
    console.log('contractor ', contractor);
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
      RESUME_TEMPLATE: {
        resume_template: contractor.template_resume,
        update: false,
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
 async getInitialData() {
  const cred = this.localStorageService.getItem('userCredentials');
  this.applicationId = cred['application_id'];
    /************************************ USER ************************************/
    this.subscriptions = this.userService.connectedUser$.subscribe(async (data) => {
      if (!!data) {
        this.userInfo = data;
        this.companyEmail = data.user[0]['company_email'];
        /********************************** REF DATA **********************************/
        await this.refDataService.getRefData(
          this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
          this.applicationId,
          [ 'GENDER', 'PROF_TITLES', 'LEGAL_FORM', 'PAYMENT_MODE']
        );
        /******************************** ACTIVITY CODE *******************************/
        this.legalList.next(this.refDataService.refData['LEGAL_FORM']);
        this.filteredLegalForm.next(this.legalList.value);
        this.utilsService.changeValueField(this.legalList.value,
          this.contractorForm.controls.ORGANISATION['controls'].filteredLegalOrganisation,
          this.filteredLegalForm
        );
        this.genderList.next(this.refDataService.refData['GENDER']);
        this.filteredGenders.next(this.genderList.value.slice());

        this.utilsService.changeValueField(this.genderList.value,
          this.contractorForm.controls.CONTACT['controls'].filteredGenderContact,
          this.filteredGenders
          );
        this.profileTitleList.next(this.refDataService.refData['PROF_TITLES']);
        this.filteredTitles.next(this.profileTitleList.value);
        this.utilsService.changeValueField(this.profileTitleList.value,
          this.contractorForm.controls.CONTACT['controls'].filteredTitleContact,
          this.filteredTitles
        );
        this.paymentModeList.next(this.refDataService.refData['PAYMENT_MODE']);
        this.filteredPayMode.next(this.profileTitleList.value);
        this.utilsService.changeValueField(this.paymentModeList.value,
          this.contractorForm.controls.ORGANISATION['controls'].filteredPayementOrganisation,
          this.filteredPayMode
        );

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
    this.filteredCurrencies.next(this.currencyList.value);
    this.utilsService.changeValueField(
      this.currencyList.value,
      this.contractorForm.controls.ORGANISATION['controls'].filteredCurrencyOrganisation,
      this.filteredCurrencies
    );
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
      this.contractorService.getContractorsContact(`?contractor_code=${atob(params.cc)}&email_address=${atob(params.ea)}&status=ACTIVE`)
    ])
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        async (res) => {
          this.contractorInfo = res[0]['results'][0];
          this.haveImage.next(res[0]['results'][0]['photo']);
          const av = await this.uploadService.getImage(res[0]['results'][0]['photo']);
          this.avatar.next(av);

          res[1]['results'][0] === [] ? this.contractorContactInfo = [] : this.contractorContactInfo = res[1]['results'];
         this.contractorContactInfo.map(
           async (contact) => {
              contact.title_cd = await this.refDataService.refData['PROF_TITLES'].find((type) =>
                type.value === contact.title_cd)?.viewValue;
            }
          );
          this.updateForms(this.contractorInfo);
          this.contactList.next(this.contractorContactInfo.slice());

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
      template_resume: '',
      update: true,
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
      /*** RESUME TEMPLATE ***/
      Contractor.template_resume = this.contractorForm.controls.RESUME_TEMPLATE['controls'].resume_template.value;
      Contractor.update = this.contractorForm.controls.RESUME_TEMPLATE['controls'].update.value;
      this.contractorService.updateContractor(Contractor)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (res) => {
            this.utilsService.openSnackBar('Contractor update successfully', 'close');

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
          contact.title_cd = this.refDataService.refData['PROF_TITLES'].find((type) =>
                type.viewValue === contact.title_cd)?.value;
          if (contact._id && contact?.updated) {
            this.contractorService.updateContractorContact(contact)
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(
                (response) => {
                },
                (error) => {
                  console.log('error', error);
                },
                () => {
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
                },
                error => {
                  console.log('error', error);
                },
                () => {

                }
              );
          }
        }
      );
      this.utilsService.openSnackBar('Contractor updated successfully ', null, 5000);
      if (this.type === 'CLIENT') {
        this.router.navigate(
          ['/manager/contract-management/clients-contracts/clients-list']);
      } else if (this.type === 'SUPPLIER') {
        this.router.navigate(
          ['/manager/contract-management/suppliers-contracts/suppliers-list']);
      }
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
      /*** RESUME TEMPLATE ***/
      const templateValue = this.contractorForm.controls.RESUME_TEMPLATE['controls'].resume_template.value;
      Contractor.template_resume = templateValue !== '' ? templateValue : 'DEFAULT';
      Contractor.update = this.contractorForm.controls.RESUME_TEMPLATE['controls'].update.value;

      Contractor.creation_date = Date.now();
      this.contractorService.addContractor(Contractor)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            this.contractorContactInfo.forEach(
              async (contact) => {
                contact.application_id = Contractor.application_id;
                contact.email_address = Contractor.email_address;
                contact.contractor_code = Contractor.contractor_code;
                contact.title_cd = this.refDataService.refData['PROF_TITLES'].find((type) =>
                  type.viewValue === contact.title_cd)?.value;
                await this.contractorService.addContractorContact(contact)
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

                    }
                  );

              }
            );
            this.utilsService.openSnackBar('Contractor added successfully ', null, 5000);
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
        this.contractorContactInfo.forEach(
          (element, index) => {
            if ( (element.contractorContactKey ? element.contractorContactKey.contact_email  : element.contact_email  ) ===
              this.contractorForm.controls.CONTACT['controls'].contact_email.value) {
              this.contractorContactInfo[index].first_name = this.contractorForm.controls.CONTACT['controls'].first_name.value;
              this.contractorContactInfo[index].last_name = this.contractorForm.controls.CONTACT['controls'].last_name.value;
              this.contractorContactInfo[index].main_contact = this.contractorForm.controls.CONTACT['controls'].main_contact.value;
              this.contractorContactInfo[index].contact_email = this.contractorForm.controls.CONTACT['controls'].contact_email.value;
              this.contractorContactInfo[index].gender_cd = this.contractorForm.controls.CONTACT['controls'].gender_cd.value;
              this.contractorContactInfo[index].title_cd = this.refDataService.refData['PROF_TITLES'].find((type) =>
                type.value === this.contractorForm.controls.CONTACT['controls'].title_cd.value)?.viewValue;
              this.contractorContactInfo[index].phone_nbr = this.contractorForm.controls.CONTACT['controls'].phone_nbr.value;
              this.contractorContactInfo[index].cell_phone_nbr = this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value;
              this.contractorContactInfo[index].language_cd = this.contractorForm.controls.CONTACT['controls'].language_cd.value;
              this.contractorContactInfo[index].can_sign_contract = this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value;
              this.contractorContactInfo[index].updated = true;
            }
          }
        );
        this.contractorForm.controls.CONTACT.reset();
        this.canUpdateAction.next(false);
        this.canAddAction.next(true);
        this.contractorForm.controls.CONTACT['controls'].contact_email.enable();
      }
        break;
      case 'addMore': {
        if (
          !this.contractorForm.controls.CONTACT['controls'].contact_email.value &&
          this.contractorForm.controls.CONTACT['controls'].contact_email.value === '' ) {
          this.utilsService.openSnackBar('Email Address Required', 'close');
        } else {
          this.contactList.next([]);
          this.contractorContactInfo.push(
            {
              first_name: this.contractorForm.controls.CONTACT['controls'].first_name.value,
              last_name: this.contractorForm.controls.CONTACT['controls'].last_name.value,
              main_contact: this.contractorForm.controls.CONTACT['controls'].main_contact.value,
              contact_email: this.contractorForm.controls.CONTACT['controls'].contact_email.value,
              gender_cd: this.contractorForm.controls.CONTACT['controls'].gender_cd.value,
              title_cd: this.contractorForm.controls.CONTACT['controls'].title_cd.value ? this.refDataService.refData['PROF_TITLES'].find((type) =>
                type.value === this.contractorForm.controls.CONTACT['controls'].title_cd.value)?.viewValue : '',
              phone_nbr: this.contractorForm.controls.CONTACT['controls'].phone_nbr.value,
              cell_phone_nbr: this.contractorForm.controls.CONTACT['controls'].cell_phone_nbr.value,
              language_cd: this.contractorForm.controls.CONTACT['controls'].language_cd.value,
              can_sign_contract: this.contractorForm.controls.CONTACT['controls'].can_sign_contract.value,
            }
          );
          this.contactList.next(this.contractorContactInfo.slice());
          this.contractorForm.controls.CONTACT.reset();
          this.utilsService.openSnackBar('Contact Added', 'close');
        }
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
  onStatusChange(row) {
    const confirmation = {
      code: 'delete',
      title: 'delete Info',
      description: `Are you sure you want to delete ?`,
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {
            let code = '';
            let index = 0;
            let element = null;
           if (row.formGroupName === 'CONTACT') {
             code = row.data.contractorContactKey?.contractor_code ? row.data.contractorContactKey?.contractor_code : row.data.contractor_code;
             element = this.contractorContactInfo.filter(x => x.contractorContactKey?.contractor_code === code || x.contractor_code === code)[0];
             index = this.contractorContactInfo.indexOf(element);
             if (index !== -1) {
               this.contractorContactInfo.splice(index, 1);
               this.contactList.next(this.contractorContactInfo.slice());
               if (row.data._id) {
                 this.contractorService.disableContractorContact(row.data._id)
                   .pipe(
                     takeUntil(this.destroy$)
                   )
                   .subscribe(
                     (res1) => {

                     }
                   );
               }
             }
             this.utilsService.openSnackBar('contact deleted successfully', 'close');

           }

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
      case('delete'):  this.onStatusChange(rowAction);
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
      this.refDataService.refData['PROF_TITLES'].find((type) =>
      type.viewValue === row.title_cd)?.value);
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
