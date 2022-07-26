import {  Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, ReplaySubject, Subject, Subscription } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { IContractor } from '@shared/models/contractor.model';
import { takeUntil } from 'rxjs/operators';
import { IContract } from '@shared/models/contract.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';
import { SheetService } from '@core/services/sheet/sheet.service';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { FieldsAlignment, FieldsType, IDynamicForm, InputType } from '@shared/models/dynamic-component/form.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { TimesheetSettingService } from '@core/services/timesheet-setting/timesheet-setting.service';
import { ICompanyTimesheetSettingModel } from '@shared/models/CompanyTimesheetSetting.model';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit, OnDestroy {

  constructor(
    private contractsService: ContractsService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private utilsService: UtilsService,
    private translateService: TranslateService,
    private contractorService: ContractorsService,
    private appInitializerService: AppInitializerService,
    private assetsDataService: AssetsDataService,
    private companyPaymentTermsService: CompanyPaymentTermsService,
    private sheetService: SheetService,
    private uploadService: UploadService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private refDataService: RefdataService,
    private localStorageService: LocalStorageService,
    private profileService: ProfileService,
    private companyTimeSheetService: TimesheetSettingService,
    private modalServices: ModalService,

  ) {
    this.contractForm = new FormGroup({ });
  }

  /**************************************************************************
   * @description Input from child's Components [SUPPLIERS, CLIENTS]
   *************************************************************************/
  @Input() type: string;
  @Input() title: string;

  /**************************************************************************
   * @description new Data Declarations 'LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES'
   *************************************************************************/
  citiesList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  legalList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  profileTitleList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  currencyList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  statusList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  paymentTermsList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  contractorsList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  vatList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  collaboratorList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  projectList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  contractorContactList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  staffList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  contractorContacts: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  contractExtensionInfo = [];
  contractProjectInfo = [];
  projectCollaboratorInfo = [];
  extensionsList: BehaviorSubject<any> = new BehaviorSubject<any>(this.contractExtensionInfo);
  contractProjectList: BehaviorSubject<any> = new BehaviorSubject<any>(this.contractProjectInfo);
  projectCollaboratorList: BehaviorSubject<any> = new BehaviorSubject<any>(this.projectCollaboratorInfo);
  canUpdateAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateContractProjectAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddContractProjectAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateProjectCollaboratorAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddProjectCollaboratorAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  companyTimesheet: ICompanyTimesheetSettingModel;
  categoriesList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  /**************************************************************************
   * @description Declaring Form Group
   *************************************************************************/
  contractForm: FormGroup;
  digitalPattern = /^(0|[1-9][0-9]*)$/;

  /**************************************************************************
   * @description Declare the new ContractId to be used on update
   *************************************************************************/
  contractId: string;
  /**************************************************************************
   * @description Declare application id
   *************************************************************************/
  applicationId: string;
  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserInfo;
  contractInfo: IContract;
  companyEmail: string;
  contractors: IContractor[] = [];
  minDate: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  /**************************************************************************
   * @description Dynamic Component
   *************************************************************************/
  isLoading = new BehaviorSubject<boolean>(false);

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  private subscriptions: Subscription[] = [];
  private subscriptionModal: Subscription;

  /**************************************************************************
   * @description list of Data filtered by search keyword
   *************************************************************************/
  filteredCurrencies: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredStatus: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredVat: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredCategories: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);

  avatar: any;
  selectedContractFile = { file: FormData, name: ''};
  selectedExtensionFile = [];

  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  contractItems: IDynamicMenu[] = [
    {
      title: 'contracts.menu.name',
      titleKey: 'CONTRACT',
      required: true,
      child: [
        {
          title: 'Information',
          titleKey: 'INFORMATION',
          required: true
        },
        {
          title: 'contracts.menu.signer',
          titleKey: 'SIGNER',
          required: true
        },
        {
          title: 'contracts.menu.rate',
          titleKey: 'RATE',
          required: true
        },
        {
          title: 'contracts.menu.time',
          titleKey: 'TIMESHEET',
          required: true
        }
      ]
    },
    {
      title: 'contracts.menu.ext',
      titleKey: 'CONTRACT_EXTENSION',
      child: []
    },
    {
      title: 'contracts.menu.pro',
      titleKey: 'CONTRACT_PROJECT',
      required: true,
      child: []
    },
    {
      title: 'project_collaborator_all',
      titleKey: 'PROJECT_COLLABORATOR',
      required: true,
      child: []
    },
  ];
  dynamicForm: BehaviorSubject<IDynamicForm[] > = new BehaviorSubject<IDynamicForm[]>([
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.contractor.name',
          placeholder: 'contracts.addcontrat.contractor.name',
          type: FieldsType.SELECT,
          selectFieldList: this.contractorsList,
          formControlName: 'contractor_code',
          required: true
        },
        {
          label: 'contracts.addcontrat.status',
          placeholder: 'contracts.addcontrat.status',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredStatus,
          formControlName: 'contract_status',
          searchControlName: 'contractStatusFilter',
          required: true
        },
      ],
    },
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.information.start_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'contract_start_date',
          required: true
        },
        {
          label: 'contracts.addcontrat.information.end_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'contract_end_date',
          minDate: this.minDate,
          required: true
        },
      ],
    },
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'attachment_all',
          placeholder: 'attachment_all',
          type: FieldsType.UPLOAD_FILE,
          inputType: InputType.TEXT,
          formControlName: 'attachments'
        },
      ],
    },
    {
      titleRef: 'SIGNER',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.signer.company.signer',
          placeholder: 'contracts.addcontrat.signer.company.signer',
          type: FieldsType.SELECT,
          selectFieldList: this.staffList,
          formControlName: 'signer_company_email',
          required: true
        },
        {
          label: 'contracts.addcontrat.signer.contractor.signer',
          placeholder: 'contracts.addContract.add.contractor.contact',
          type: FieldsType.SELECT,
          selectFieldList: this.contractorContactList,
          formControlName: 'signer_contractor_email',
          required: true
        },
      ],
    },
    {
      titleRef: 'SIGNER',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.signer.company.signer_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'signature_company_date',
          required: true
        },
        {
          label: 'contracts.addcontrat.signer.contractor.signer_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'signature_contractor_date',
          required: true
        },
      ],
    },
    {
      titleRef: 'RATE',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'contract_rate',
          required: true
        },
        {
          label: 'contracts.addcontrat.rate.currency',
          placeholder: 'contracts.addcontrat.rate.currency',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCurrencies,
          formControlName: 'currency_cd',
          searchControlName: 'filterCurrencyControl',
          required: true
        },
      ],
    },
    {
      titleRef: 'RATE',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'contracts.addcontrat.rate.payment.method',
          placeholder: 'contracts.addcontrat.rate.payment.method',
          type: FieldsType.SELECT,
          selectFieldList: this.paymentTermsList,
          formControlName: 'payment_terms',
          required: true
        },
      ],
    },
    {
      titleRef: 'TIMESHEET',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.timesheet.working.hour',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'working_hour_day',
        },
        {
          label: 'contracts.addcontrat.timesheet.holiday.rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'holiday_rate',
        },
      ],
    },
    {
      titleRef: 'TIMESHEET',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.timesheet.saturday.rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'saturday_rate',
        },
        {
          label: 'contracts.addcontrat.timesheet.sunday.rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'sunday_rate',
        },
      ],
    },
    {
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.one_item_stretch,
      fields: [
        {
          type: FieldsType.DATA_TABLE,
          dataTable: {
            displayedColumns: [
              'rowItem',
              'extension_start_date', 'extension_end_date',
              'extension_rate', 'extension_currency_cd',
              'extension_status', 'attachments',
              'Actions'],
            columns: [
              { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
              { name: 'contracts.extensioncontract.table.startdate', prop: 'extension_start_date', type: InputType.DATE},
              { name: 'contracts.extensioncontract.table.enddate', prop: 'extension_end_date', type: InputType.DATE},
              { name: 'contracts.extensioncontract.table.rate', prop: 'extension_rate', type: InputType.TEXT},
              { name: 'contracts.extensioncontract.table.currency', prop: 'extension_currency_cd', type: InputType.TEXT},
              { name: 'contracts.extensioncontract.table.status', prop: 'extension_status', type: InputType.TEXT},
              { name: 'contracts.extensioncontract.table.attachment', prop: 'attachments', type: InputType.TEXT},
              { prop: 'Actions',  name: 'contracts.extensioncontract.table.actions', type: InputType.ACTIONS},
            ],
            dataSource: this.extensionsList
          }
        },
      ],
    },
    {
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.ext.start_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'extension_start_date',
          required: true
        },
        {
          label: 'contracts.addcontrat.ext.end_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'extension_end_date',
          required: true
        },
      ],
    },
    {
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.ext.rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'extension_rate',
          required: true
        },
        {
          label: 'contracts.addcontrat.ext.currency',
          placeholder: 'contracts.addcontrat.ext.currency',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCurrencies,
          formControlName: 'extension_currency_cd',
          searchControlName: 'filterCurrencyControl',
          required: true
        },
      ],
    },
    {
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.ext.status',
          placeholder: 'contracts.addcontrat.ext.status',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredStatus,
          formControlName: 'extension_status',
          searchControlName: 'filterStatusControl',
          required: true
        },
        {
          label: 'contracts.addcontrat.ext.file',
          placeholder: 'contracts.addcontrat.ext.file',
          type: FieldsType.UPLOAD_FILE,
          inputType: InputType.TEXT,
          formControlName: 'attachments',
        },
      ],
    },
    {
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.one_item_at_right,
      fields: [
        {
          type: FieldsType.ADD_MORE_OR_UPDATE,
          canUpdate: this.canUpdateAction,
          canAdd: this.canAddAction,
        },
      ],
    },
    {
      titleRef: 'CONTRACT_PROJECT',
      fieldsLayout: FieldsAlignment.one_item_stretch,
      fields: [
        {
          type: FieldsType.DATA_TABLE,
          dataTable: {
            displayedColumns: [
              'rowItem',
              'project_rate',
              'start_date', 'end_date',
              'Actions'],
            columns: [
              { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
              { name: 'contracts.projectcontract.table.rate', prop: 'project_rate', type: InputType.TEXT},
              { name: 'contracts.projectcontract.table.startdate', prop: 'start_date', type: InputType.DATE},
              { name: 'contracts.projectcontract.table.enddate', prop: 'end_date', type: InputType.DATE},
              { prop: 'Actions',  name: 'contracts.projectcontract.table.actions', type: InputType.ACTIONS},
            ],
            dataSource: this.contractProjectList
          }
        },
      ],
    },
    {
      titleRef: 'CONTRACT_PROJECT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.contractProject.projectname',
          placeholder: 'contracts.addcontrat.contractProject.projectname',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'project_name',
          required: true
        },
        {
          label: 'contracts.addcontrat.contractProject.category',
          placeholder: 'contracts.addcontrat.contractProject.category',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCategories,
          formControlName: 'category_code',
          searchControlName: 'filterCategorieControl',
          required: true
        },
      ],
    },
    {
      titleRef: 'CONTRACT_PROJECT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.contractProject.start_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'start_date',
          required: true
        },
        {
          label: 'contracts.addcontrat.contractProject.end_date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'end_date',
          required: true
        },
      ],
    },
    {
      titleRef: 'CONTRACT_PROJECT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.contractProject.rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'project_rate',
          required: true
        },
        {
          label: 'contracts.addcontrat.contractProject.currency',
          placeholder: 'contracts.addcontrat.contractProject.currency',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredCurrencies,
          formControlName: 'rate_currency',
          searchControlName: 'filterCurrencyControl',
          required: true
        },
      ],
    },
    {
      titleRef: 'CONTRACT_PROJECT',
      fieldsLayout: FieldsAlignment.tow_items_with_textarea,
      fields: [
        {
          label: 'contracts.addsupplier.organisation.vat',
          placeholder: 'contracts.addsupplier.organisation.vat',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredVat,
          formControlName: 'vat_nbr',
          searchControlName: 'filterVatControl',
          required: true
        },
        {
          label: 'contracts.addcontrat.contractProject.status',
          placeholder: 'contracts.addcontrat.contractProject.status',
          type: FieldsType.SELECT_WITH_SEARCH,
          filteredList: this.filteredStatus,
          formControlName: 'project_status',
          searchControlName: 'filterStatusControl',
          required: true
        },
        {
          label: 'contracts.addcontrat.contractProject.description',
          placeholder: 'contracts.addcontrat.contractProject.description',
          type: FieldsType.TEXTAREA,
          formControlName: 'project_desc',
          required: true
        }
      ],
    },
    {
      titleRef: 'CONTRACT_PROJECT',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'contracts.addcontrat.contractProject.comment',
          placeholder: 'contracts.addcontrat.contractProject.comment',
          type: FieldsType.INPUT,
          inputType: InputType.TEXT,
          formControlName: 'comment',
        },
      ],
    },
    {
      titleRef: 'CONTRACT_PROJECT',
      fieldsLayout: FieldsAlignment.one_item_at_right,
      fields: [
        {
          type: FieldsType.ADD_MORE_OR_UPDATE,
          canUpdate: this.canUpdateContractProjectAction,
          canAdd: this.canAddContractProjectAction,
        },
      ],
    },
    {
      titleRef: 'PROJECT_COLLABORATOR',
      fieldsLayout: FieldsAlignment.one_item_stretch,
      fields: [
        {
          type: FieldsType.DATA_TABLE,
          dataTable: {
            displayedColumns: [
              'rowItem',
              'project_code', 'email_address',
              'start_date', 'end_date',
              'Actions'],
            columns: [
              { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
              { name: 'contracts.projectcollaborator.code', prop: 'project_code', type: InputType.TEXT},
              { name: 'contracts.projectcollaborator.email', prop: 'email_address', type: InputType.EMAIL},
              { name: 'contracts.projectcollaborator.startdate', prop: 'start_date', type: InputType.DATE},
              { name: 'contracts.projectcollaborator.enddate', prop: 'end_date', type: InputType.DATE},
              { prop: 'Actions',  name: 'contracts.projectcollaborator.actions', type: InputType.ACTIONS},
            ],
            dataSource: this.projectCollaboratorList
          }
        },
      ],
    },
    {
      titleRef: 'PROJECT_COLLABORATOR',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.projectCollab.projectCode',
          placeholder: 'contracts.addcontrat.projectCollab.projectCode',
          type: FieldsType.SELECT,
          selectFieldList: this.projectList,
          searchControlName: 'projectCodeFilterCtrl',
          formControlName: 'project_code',
          required: true
        },
        {
          label: 'contracts.addcontrat.projectCollab.emailCollab',
          placeholder: 'contracts.addcontrat.projectCollab.emailCollab',
          type: FieldsType.SELECT,
          selectFieldList: this.collaboratorList,
          searchControlName: 'emailAddressFilterCtrl',
          formControlName: 'email_address',
          required: true
        },
      ],
    },
    {
      titleRef: 'PROJECT_COLLABORATOR',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'contracts.addcontrat.projectCollab.startDate',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'start_date',
          required: true
        },
        {
          label: 'contracts.addcontrat.projectCollab.endDate',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'end_date',
          required: true
        },
      ],
    },
    {
      titleRef: 'PROJECT_COLLABORATOR',
      fieldsLayout: FieldsAlignment.one_item_at_right,
      fields: [
        {
          type: FieldsType.ADD_MORE_OR_UPDATE,
          canUpdate: this.canUpdateProjectCollaboratorAction,
          canAdd: this.canAddProjectCollaboratorAction,
        },
      ],
    },
  ]);

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
 async ngOnInit() {
   await this.initContractForm(null);
   await this.getInitialData();
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(params => {
        if (this.canUpdate(params.id)) {
          this.contractId = params.id;
          this.getContractor();
          this.getContractByID(params);
        }
      });
    this.sheetService.registerSheets(
      [
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent},
      ]);
    this.getSignerContractor();
    this.onContractStatusChanges();

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
 async getInitialData() {
  const cred = this.localStorageService.getItem('userCredentials');
    this.subscriptions.push(
      await this.userService.connectedUser$.subscribe((data) => {
        if (!!data) {
          this.userInfo = data;
          this.companyEmail = data.user[0]['company_email'];
          this.getTimeSheetSettings();
          this.getPaymentTerms();
        }
      }),

    );
  this.applicationId = cred['application_id'];
    /************ get currencies List and next the value to the subject ************/
    /********************************** CURRENCY **********************************/
    this.currencyList.next(this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC};
    }));
    this.filteredCurrencies.next(this.currencyList.value);
    this.utilsService.changeValueField(this.currencyList.value,
      this.contractForm.controls.RATE['controls'].filterCurrencyControl,
      this.filteredCurrencies
    );
    this.utilsService.changeValueField(this.currencyList.value,
      this.contractForm.controls.CONTRACT_PROJECT['controls'].filterCurrencyControl,
      this.filteredCurrencies
    );
    this.utilsService.changeValueField(this.currencyList.value,
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].filterCurrencyControl,
      this.filteredCurrencies
    );
    await this.profileService.getAllUser(this.companyEmail, 'STAFF')
      .subscribe((res) => {
        if (res['results'].length !== 0) {
          this.staffList.next(res['results'].map(
                  (obj) => {
                    return { value: obj.userKey.email_address, viewValue: obj.first_name + ' ' + obj.last_name };
                  }
              )
          );
        } else {
          this.dynamicForm.getValue()[3].fields[0] = {
            label: 'contracts.addcontrat.signer.company.signer',
            placeholder: 'contracts.addContract.add.staff',
            type: FieldsType.INPUT,
            formControlName: 'signer_company_email',
            required: true
          };
          this.contractForm.controls.SIGNER['controls'].signer_company_email.disable();

        }

      });
    await this.profileService.getAllUser(this.companyEmail, 'COLLABORATOR')
      .subscribe((res) => {
        if (res['results'].length !== 0) {
          this.collaboratorList.next(
              res['results'].map(
                  (obj) => {
                    return { value: obj.userKey.email_address, viewValue: obj.first_name + ' ' + obj.last_name };
                  }
              )
          );
        } else {
          this.dynamicForm.getValue()[16].fields[1] = {
            label: 'contracts.addcontrat.projectCollab.emailCollab',
            placeholder: 'contracts.addContract.add.collaborator',
            type: FieldsType.INPUT,
            formControlName: 'email_address',
            required: true
          };
          this.contractForm.controls.PROJECT_COLLABORATOR['controls'].email_address.disable();

        }

      });

    /*---------------------------------------------------------------*/
   await this.refDataService.getRefData(
      this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
      this.applicationId,
      ['LEGAL_FORM', 'VAT', 'PROJECT_CATEGORIES' , 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES']
    );
   this.vatList.next(this.refDataService.refData['VAT']);
   this.filteredVat.next(this.vatList.value);
    this.utilsService.changeValueField(this.vatList.value,
      this.contractForm.controls.CONTRACT_PROJECT['controls'].filterVatControl,
      this.filteredVat
    );
    this.categoriesList.next(this.refDataService.refData['PROJECT_CATEGORIES']);
    this.filteredCategories.next(this.categoriesList.value);
    this.utilsService.changeValueField(this.categoriesList.value,
        this.contractForm.controls.CONTRACT_PROJECT['controls'].filterCategorieControl,
        this.filteredCategories
    );
    this.statusList.next(this.refDataService.refData['CONTRACT_STATUS']);
    this.filteredStatus.next(this.statusList.value);
    this.utilsService.changeValueField(this.statusList.value,
      this.contractForm.controls.INFORMATION['controls'].contractStatusFilter,
      this.filteredStatus
      );
    await this.getContractorStatus(this.type);
    this.utilsService.changeValueField(this.statusList.value,
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].filterStatusControl,
      this.filteredStatus
    );
    this.utilsService.changeValueField(this.statusList.value,
      this.contractForm.controls.CONTRACT_PROJECT['controls'].filterStatusControl,
      this.filteredStatus
    );
    this.getContractor();

  }

  /**
   * @description
   */
  getContractor() {
    this.contractorService
        .getContractors(`?contractor_type=${this.type}&email_address=${this.companyEmail}${!this.contractId ? '&status=ACTIVE' : '' }`)
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe(
            (res) => {
              this.contractors = res['results'];
              if (res['results'].length !== 0) {
                this.contractorsList.next(
                    res['results'].map(
                        (obj) => {
                          return { value: obj.contractorKey.contractor_code, viewValue: obj.contractor_name };
                        }
                    )
                );
              } else {
                this.dynamicForm.getValue()[0].fields[0] = {
                  label: 'contracts.addcontrat.contractor.name',
                  placeholder: 'contracts.addContract.add.contractor',
                  type: FieldsType.INPUT,
                  formControlName: 'contractor_code',
                  required: true
                };
                this.contractForm.controls.INFORMATION['controls'].contractor_code.disable();

              }

            },
            (error) => {
              console.log('error', error);
            },
        );
  }
  /**************************************************************************
   * @description Get Signer for specific contractor
   *************************************************************************/
   getSignerContractor(contractor_code?: string) {
     if (contractor_code === undefined) {
       this.contractForm.get('INFORMATION').valueChanges.subscribe(selectedValue => {
         if (selectedValue?.contractor_code !== '') {
           this.getContractorContact(selectedValue?.contractor_code).then(
             (data) => {
               this.contractorContacts.next(data);
               this.dynamicForm.getValue()[3].fields[1] = {
                 label: 'contracts.addcontrat.signer.contractor.signer',
                 placeholder: 'contracts.addContract.add.contractor.contact',
                 type: FieldsType.SELECT,
                 selectFieldList: this.contractorContacts,
                 formControlName: 'signer_contractor_email',
               };
             });
         }

       });
     } else {
       this.getContractorContact(contractor_code).then(
         (data) => {
           this.contractorContacts.next(data);
           this.dynamicForm.getValue()[3].fields[1] = {
             label: 'contracts.addcontrat.signer.contractor.signer',
             placeholder: 'contracts.addContract.add.contractor.contact',
             type: FieldsType.SELECT,
             selectFieldList: this.contractorContacts,
             formControlName: 'signer_contractor_email',
           };
         });
     }

  }

  /**
   * @description on contract status changes
   */
  onContractStatusChanges() {

    this.contractForm.get('INFORMATION').valueChanges.subscribe(selectedValue => {
      if (selectedValue?.contract_status === 'RUN' || selectedValue?.contract_status === 'EX_AW' ) {
        this.disableContractExtension();
      } else {
      this.enableContractExtension();
      }
      if (selectedValue?.contract_status === 'CUST_SIGN' || selectedValue?.contract_status === 'SUP_SIGN') {
        this.contractForm.controls.SIGNER['controls'].signer_contractor_email.disable();
        this.contractForm.controls.SIGNER['controls'].signature_contractor_date.disable();

      } else {
        this.contractForm.controls.SIGNER['controls'].signer_contractor_email.enable();
        this.contractForm.controls.SIGNER['controls'].signature_contractor_date.enable();
      }
      });
  }
  /**
   * @description required if validators
   */
  requiredIfValidator(predicate) {
    return (formControl => {
      if (!formControl.parent) {
        return null;
      }
      if (predicate()) {
        return Validators.required(formControl);
      }
      return null;
    });
  }

  /**************************************************************************
   * @description Init form with initial data
   * empty if it's create contract + extension case
   * patch Contract (Extension not included) value if it's update case
   *************************************************************************/
  async initContractForm(contract: IContract) {
    this.contractForm = this.formBuilder.group({
      INFORMATION: this.formBuilder.group({
        contractor_code:
            [contract !== null
                ?   contract.contractor_code : '', Validators.required],
        contract_date: [contract === null ? '' : contract.contract_date],
        contract_start_date: [contract === null ? '' : contract.contract_start_date, [Validators.required]],
        contract_end_date: [contract === null ? '' : contract.contract_end_date, [Validators.required]],
        contract_status: [contract === null ? '' : contract.contract_status, [Validators.required]],
        contractStatusFilter: [''],
        status: [contract === null ? 'ACTIVE' : contract.status],
        attachments: [contract === null ? '' : await this.getFileNameAndUpdateForm(contract.attachments, 'INFORMATION')],
      }),
      SIGNER: this.formBuilder.group({
        signer_company_email: [contract === null ? '' : contract.signer_company_email, [Validators.required]],
        signer_contractor_email: [contract === null ? '' : contract.signer_contractor_email,
          [this.requiredIfValidator(() => this.contractForm.controls.INFORMATION['controls'].contract_status !== 'CUST_SIGN' &&
            this.contractForm.controls.INFORMATION['controls'].contract_status !== 'SUP_SIGN'
        )]],
        signature_company_date: [contract === null ? '' : contract.signature_company_date, [Validators.required]],
        signature_contractor_date: [contract === null ? '' : contract.signature_contractor_date
          , [this.requiredIfValidator(() => this.contractForm.controls.INFORMATION['controls'].contract_status !== 'CUST_SIGN' &&
              this.contractForm.controls.INFORMATION['controls'].contract_status !== 'SUP_SIGN'
          )]],
      }),
      RATE: this.formBuilder.group({
        contract_rate: [contract === null ? '' : contract.contract_rate, [Validators.required, Validators.min(0)]],
        currency_cd: [contract === null ? '' : contract.currency_cd, [Validators.required]],
        payment_terms: [contract === null ? '' : contract.payment_terms, [Validators.required] ],
        filterCurrencyControl: [''],
        contractPaymentFilter: [''],
        paymentTermsControl: [''],
      }),
      TIMESHEET: this.formBuilder.group({
        working_hour_day: [contract === null ? '' : contract.working_hour_day,
          [Validators.required, Validators.min(0), Validators.pattern(this.digitalPattern)]],
        holiday_rate: [contract === null ? '' : contract.holiday_rate, [Validators.required, Validators.min(0)]],
        saturday_rate: [contract === null ? '' : contract.saturday_rate, [Validators.required, Validators.min(0)]],
        sunday_rate: [contract === null ? '' : contract.sunday_rate, [Validators.required, Validators.min(0)]],
      }),
      CONTRACT_EXTENSION: this.formBuilder.group({
        extension_code: [''],
        extension_start_date: [''],
        extension_end_date: [''],
        extension_status: [''],
        extension_rate: [''],
        extension_currency_cd: [''],
        filterCurrencyControl: [''],
        filterStatusControl: [''],
        attachments: [''],
      }),
      CONTRACT_PROJECT: this.formBuilder.group({
        category_code: [''],
        project_code: [''],
        project_desc: [''],
        start_date: [''],
        end_date: [''],
        project_rate: [''],
        rate_currency: [''],
        vat_nbr: [''],
        filterCurrencyControl: [''],
        filterStatusControl: [''],
        filterVatControl: [''],
        filterCategorieControl: [''],
        project_status: [''],
        project_name: [''],
        comment: [''],
      }),
      PROJECT_COLLABORATOR: this.formBuilder.group({
        project_code: [''],
        projectCodeFilterCtrl: [''],
        email_address: [''],
        emailAddressFilterCtrl: [''],
        start_date: [''],
        end_date: [''],
      }),
    });

  }

  /**************************************************************************
   * @description Get Contractor to be updated
   *************************************************************************/
  getContractByID(params) {
    forkJoin([
      this.contractsService.getContracts(`?_id=${atob(params.id)}`),
      this.contractsService.getContractExtension(`?contract_code=${atob(params.cc)}&email_address=${atob(params.ea)}`),
      this.contractsService.getContractProject(`?contract_code=${atob(params.cc)}`),
      this.contractsService.getCollaboratorProject(`?contract_code=${atob(params.cc)}&status=ACTIVE`),
    ])
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        async (res) => {
          this.contractInfo = res[0]['results'][0];
          if (this.contractInfo.contract_status === 'EXPIRED') {
            this.contractForm.controls.INFORMATION['controls'].contract_status.disable();
          }
          this.getSignerContractor(this.contractInfo.contractor_code);
          if (res[1]['msg_code'] === '0004') {
            this.contractExtensionInfo = [];
          } else {
            this.contractExtensionInfo = res[1]['results'];
            this.contractExtensionInfo.map(
              async (extension) => {
                if (extension.attachments && extension.attachments !== '') {
                  extension.attachments = await this.getFileNameAsString(extension.attachments);
                }
              }
            );
          }
         if (res[2]['msg_code'] === '0004') {
            this.contractProjectInfo = [];
          } else {
            this.contractProjectInfo = res[2]['results'];
           this.projectList.next(
             this.contractProjectInfo.map(
               (obj) => {
                 return { value: obj.ContractProjectKey.project_code, viewValue: obj.project_name };
               }
             )
           );
         }
         if (res[3]['msg_code'] === '0004') {
           this.projectCollaboratorInfo = [];
         } else {
           this.projectCollaboratorInfo = res[3]['results'];

         }

          this.projectCollaboratorInfo.map( (project) => {

            project.project_code = project.ProjectCollaboratorKey.project_code;
            project.email_address = project.ProjectCollaboratorKey.email_address;

          });
          this.contractForm.controls.INFORMATION['controls'].contractor_code.disable();
          await this.initContractForm(this.contractInfo);
           if (this.contractInfo.contract_status === 'RUN' || this.contractInfo.contract_status === 'EX_AW' ) {
             this.disableContractExtension();
           }
           this.extensionsList.next(this.contractExtensionInfo.slice());
          this.contractProjectList.next(this.contractProjectInfo.slice());
          this.projectCollaboratorList.next(this.projectCollaboratorInfo);
          this.isLoading.next(false);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**************************************************************************
   * @description get Tax for specific company
   *************************************************************************/
  getContractorContact(contractor_code) {
    return new Promise<IViewParam[]>(resolve => {
      this.contractorService
        .getContractorsContact(
          `?application_id=${this.applicationId}&email_address=${this.companyEmail}&contractor_code=${contractor_code}&can_sign_contract=true`
        )
        .pipe(
          takeUntil(
            this.destroy$
          )
        )
        .subscribe(
          (Contacts) => {
            if (Contacts['msg_code'] !== '0004') {
              resolve(
                Contacts['results'].map(
                  (obj) => {
                    return { value: obj.contractorContactKey.contact_email, viewValue: obj.first_name + ' ' + obj.last_name};
                  }
                )
              );
            } else {
              resolve([]);
            }

          },
          (error) => {
            resolve(error);
            console.log(error);
          }
        );
    });
  }

  /**************************************************************************
   * @description get Tax for specific company
   *************************************************************************/
  getTimeSheetSettings() {
    this.companyTimeSheetService.getCompanyTimesheetSetting(this.companyEmail)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (companyTimeSheet) => {
          this.companyTimesheet = companyTimeSheet[0];
          this.contractForm.patchValue(
            {
              TIMESHEET: {
                working_hour_day: this.companyTimesheet.working_hour_day,
                holiday_rate: this.companyTimesheet.holiday_rate,
                saturday_rate: this.companyTimesheet.saturday_rate,
                sunday_rate: this.companyTimesheet.sunday_rate
              },
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }
  /**************************************************************************
   * @description get Tax for specific company
   *************************************************************************/
  /**************************************************************************
   * @description get Tax for specific company
   *************************************************************************/
  getPaymentTerms() {
    this.companyPaymentTermsService.getCompanyPaymentTerms(this.companyEmail)
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe(
            (companyPaymentTerms) => {
              this.paymentTermsList.next(
                  companyPaymentTerms['results'].map(
                      (obj) => {
                        return { value: obj.companyPaymentTermsKey.payment_terms_code, viewValue: obj.payment_terms_desc};
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
   * @description Create/Update Contract/ContractExtension
   *************************************************************************/
  async createNewContract(data: FormGroup) {
    let itemsFetched = 0;
    const Contract = {
      ...this.contractForm.controls.INFORMATION.value,
      ...this.contractForm.controls.SIGNER.value,
      ...this.contractForm.controls.RATE.value,
      ...this.contractForm.controls.TIMESHEET.value,
    };
   Contract.contractor_code = this.canUpdate(this.contractId) ?
       this.contractInfo.contractor_code : Contract.contractor_code;
    Contract.application_id = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.application_id : this.userInfo.company[0].companyKey.application_id;
    Contract.contract_code = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.contract_code : `${Math.random().toString(36).substring(7).toUpperCase()}`;
    Contract.email_address = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.email_address : this.userInfo.company[0].companyKey.email_address;
    Contract.contract_type = this.type;
    Contract.contract_date = Date.now();
    if (this.contractForm.valid) {
        if (this.contractProjectInfo.length > 0 && this.projectCollaboratorInfo.length > 0) {
            if (this.verifyDatesContractExtension(Contract.contract_start_date) && this.verifyDatesProjectContract(Contract.contract_end_date)) {
                if (Contract.contract_status === 'RUN' || Contract.contract_status === 'EX_AW') {
                    if (!this.utilsService.checkDate(new Date(Contract.signature_company_date), new Date(Contract.contract_start_date))) {
                        this.utilsService.openSnackBarWithTranslate('general.contracts.check.signature.company');
                    } else if (!this.utilsService.checkDate(new Date(Contract.signature_contractor_date), new Date(Contract.contract_start_date))) {
                        this.utilsService.openSnackBarWithTranslate('general.contracts.check.signature.contractor');
                    } else {

                        if (this.canUpdate(this.contractId)) {
                            if (this.selectedContractFile.name !== '') {
                                Contract.attachments = await this.uploadFile(this.selectedContractFile.file);
                            } else {
                                Contract.attachments = this.contractInfo.attachments;
                            }
                            this.contractsService.updateContract(Contract)
                                .pipe(
                                    takeUntil(this.destroy$)
                                )
                                .subscribe(
                                    () => {
                                        this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            for (const extension of this.contractExtensionInfo) {
                                extension.application_id = Contract.application_id;
                                extension.email_address = Contract.email_address;
                                extension.contract_code = Contract.contract_code;
                                if (extension.selectedExtensionFile && extension?.selectedExtensionFile?.name !== '') {
                                    extension.attachments = await this.uploadFile(extension.selectedExtensionFile.file);
                                }
                                if (extension._id && extension?.updated) {
                                    extension.extension_code = extension.contractExtensionKey.extension_code;
                                    this.contractsService.updateContractExtension(extension)
                                        .pipe(
                                            takeUntil(this.destroy$)
                                        )
                                        .subscribe(
                                            () => {
                                                this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                            },
                                            (error) => {
                                                console.log('error', error);
                                            },
                                            () => {
                                                itemsFetched += 1;
                                            }
                                        );
                                } else if (!extension?._id) {
                                    this.contractsService.addContractExtension(extension)
                                        .pipe(
                                            takeUntil(
                                                this.destroy$
                                            )
                                        )
                                        .subscribe(
                                            () => {
                                                this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
                                            },
                                            error => {
                                                console.log('error', error);
                                            },
                                            () => {
                                                itemsFetched += 1;
                                                if (itemsFetched ===
                                                    this.contractExtensionInfo.filter(ext => !ext._id || (ext._id && ext.updated)).length) {

                                                }
                                            }
                                        );
                                }
                            }
                            for (const project of this.contractProjectInfo) {
                                project.application_id = Contract.application_id;
                                project.company_email = Contract.email_address;
                                project.contract_code = Contract.contract_code;
                                if (project._id && project?.updated) {
                                    project.project_code = project.ContractProjectKey?.project_code;
                                    console.log('project ', project);
                                    this.contractsService.updateContractProject(project)
                                        .pipe(
                                            takeUntil(this.destroy$)
                                        )
                                        .subscribe(
                                            () => {
                                                this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                            },
                                            (error) => {
                                                console.log('error', error);
                                            },
                                            () => {
                                                itemsFetched += 1;
                                            }
                                        );
                                } else if (!project?._id) {
                                  console.log('project ', project);
                                    this.contractsService.addContractProject(project)
                                        .pipe(
                                            takeUntil(
                                                this.destroy$
                                            )
                                        )
                                        .subscribe(
                                            (res) => {
                                                this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
                                                console.log('resss ', res);
                                            },
                                            error => {
                                                console.log('error', error);
                                            },
                                            () => {
                                                itemsFetched += 1;
                                                if (itemsFetched ===
                                                    this.contractProjectInfo
                                                        .filter(ext => !ext._id || (ext._id && ext.updated)).length) {

                                                }
                                            }
                                        );
                                }
                            }
                            for (const projectCollaborator of this.projectCollaboratorInfo) {
                                projectCollaborator.contract_code = Contract.contract_code;
                                if (projectCollaborator._id && projectCollaborator?.updated) {
                                    this.contractsService.updateProjectCollaborator(projectCollaborator)
                                        .pipe(
                                            takeUntil(this.destroy$)
                                        )
                                        .subscribe(
                                            () => {
                                                this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                            },
                                            (error) => {
                                                console.log('error', error);
                                            },
                                            () => {
                                                itemsFetched += 1;
                                            }
                                        );
                                } else if (!projectCollaborator?._id) {
                                    this.contractsService.addProjectCollaborator(projectCollaborator)
                                        .pipe(
                                            takeUntil(
                                                this.destroy$
                                            )
                                        )
                                        .subscribe(
                                            (resp) => {
                                                if (resp['msg_code'] === '0001') {
                                                    this.utilsService
                                                        .openSnackBarWithTranslate
                                                        ('general.contracts.check.collaborator.affected', null, 5000);

                                                } else {
                                                    this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);

                                                }
                                            },
                                            error => {
                                                console.log('error', error);
                                            },
                                            () => {
                                                itemsFetched += 1;
                                                if (itemsFetched === this.projectCollaboratorInfo
                                                    .filter(ext => !ext._id || (ext._id && ext.updated)).length) {

                                                }
                                            }
                                        );
                                }
                            }

                        } else {
                            if (this.selectedContractFile.name !== '') {
                                Contract.attachments = await this.uploadFile(this.selectedContractFile.file);
                            } else {
                                Contract.attachments = '';
                            }
                            if (!this.utilsService.checkDate(new Date(Contract.contract_start_date), new Date(Contract.contract_end_date))) {
                                this.utilsService.openSnackBarWithTranslate('general.contracts.check.date');
                            } else {
                                this.contractsService.addContract(Contract)
                                    .pipe(
                                        takeUntil(this.destroy$)
                                    )
                                    .subscribe(
                                        async () => {
                                            for (const extension of this.contractExtensionInfo) {
                                                extension.application_id = Contract.application_id;
                                                extension.email_address = Contract.email_address;
                                                extension.contract_code = Contract.contract_code;
                                                if (extension.selectedExtensionFile?.name !== '' && extension.attachments) {
                                                    extension.attachments = await this.uploadFile(extension.selectedExtensionFile.file);
                                                }
                                                await this.contractsService.addContractExtension(extension)
                                                    .pipe(
                                                        takeUntil(
                                                            this.destroy$
                                                        )
                                                    )
                                                    .subscribe(
                                                        async () => {

                                                        },
                                                        error => {
                                                            console.log('error', error);
                                                        },
                                                        () => {

                                                        }
                                                    );
                                            }
                                            for (const project of this.contractProjectInfo) {
                                                project.application_id = Contract.application_id;
                                                project.company_email = Contract.email_address;
                                                project.contract_code = Contract.contract_code;

                                                await this.contractsService.addContractProject(project)
                                                    .pipe(
                                                        takeUntil(
                                                            this.destroy$
                                                        )
                                                    )
                                                    .subscribe(
                                                        async (resp) => {
                                                            this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);

                                                        },
                                                        error => {
                                                            console.log('error', error);
                                                        },
                                                        () => {

                                                        }
                                                    );
                                            }
                                            for (const projectCollaborator of this.projectCollaboratorInfo) {
                                                projectCollaborator.contract_code = Contract.contract_code;
                                                await this.contractsService.addProjectCollaborator(projectCollaborator)
                                                    .pipe(
                                                        takeUntil(
                                                            this.destroy$
                                                        )
                                                    )
                                                    .subscribe(
                                                        (resp1) => {
                                                            if (resp1['msg_code'] === '0001') {
                                                                this.utilsService
                                                                    .openSnackBarWithTranslate
                                                                    ('general.contracts.check.collaborator.affected', null, 5000);

                                                            } else {
                                                                this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);

                                                            }
                                                        },
                                                        error => {
                                                            console.log('error', error);
                                                        },
                                                        () => {
                                                        }
                                                    );

                                            }
                                            this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);

                                        },
                                        (error) => {
                                            console.log(error);

                                        },
                                        () => {
                                            itemsFetched += 1;
                                        }
                                    );
                            }

                        }
                    }
                } else {

                    if (this.canUpdate(this.contractId)) {
                        if (this.selectedContractFile.name !== '') {
                            Contract.attachments = await this.uploadFile(this.selectedContractFile.file);
                        } else {
                            Contract.attachments = this.contractInfo.attachments;
                        }
                        this.contractsService.updateContract(Contract)
                            .pipe(
                                takeUntil(this.destroy$)
                            )
                            .subscribe(
                                (res) => {
                                    this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        for (const extension of this.contractExtensionInfo) {
                            extension.application_id = Contract.application_id;
                            extension.email_address = Contract.email_address;
                            extension.contract_code = Contract.contract_code;
                            if (extension.selectedExtensionFile && extension?.selectedExtensionFile?.name !== '') {
                                extension.attachments = await this.uploadFile(extension.selectedExtensionFile.file);
                            }
                            if (extension._id && extension?.updated) {
                                extension.extension_code = extension.contractExtensionKey.extension_code;
                                this.contractsService.updateContractExtension(extension)
                                    .pipe(
                                        takeUntil(this.destroy$)
                                    )
                                    .subscribe(
                                        (response) => {
                                            this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                        },
                                        (error) => {
                                            console.log('error', error);
                                        },
                                        () => {
                                            itemsFetched += 1;
                                        }
                                    );
                            } else if (!extension?._id) {
                                this.contractsService.addContractExtension(extension)
                                    .pipe(
                                        takeUntil(
                                            this.destroy$
                                        )
                                    )
                                    .subscribe(
                                        (resp) => {
                                            this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
                                        },
                                        error => {
                                            console.log('error', error);
                                        },
                                        () => {
                                            itemsFetched += 1;

                                        }
                                    );
                            }
                        }
                        for (const project of this.contractProjectInfo) {
                            project.application_id = Contract.application_id;
                            project.company_email = Contract.email_address;
                            project.contract_code = Contract.contract_code;
                            if (project._id && project?.updated) {
                              console.log('project ', project);
                                project.project_code = project.ContractProjectKey?.project_code;
                                this.contractsService.updateContractProject(project)
                                    .pipe(
                                        takeUntil(this.destroy$)
                                    )
                                    .subscribe(
                                        (response) => {
                                            this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                        },
                                        (error) => {
                                            console.log('error', error);
                                        },
                                        () => {
                                            itemsFetched += 1;
                                        }
                                    );
                            } else if (!project?._id) {
                              console.log('project ', project);
                                this.contractsService.addContractProject(project)
                                    .pipe(
                                        takeUntil(
                                            this.destroy$
                                        )
                                    )
                                    .subscribe(
                                        (resp) => {
                                            this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
                                        },
                                        error => {
                                            console.log('error', error);
                                        },
                                        () => {
                                            itemsFetched += 1;

                                        }
                                    );
                            }
                        }
                        for (const projectCollaborator of this.projectCollaboratorInfo) {
                            projectCollaborator.contract_code = Contract.contract_code;
                            if (projectCollaborator._id && projectCollaborator?.updated) {
                                this.contractsService.updateProjectCollaborator(projectCollaborator)
                                    .pipe(
                                        takeUntil(this.destroy$)
                                    )
                                    .subscribe(
                                        (response) => {
                                            this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);
                                        },
                                        (error) => {
                                            console.log('error', error);
                                        },
                                        () => {
                                            itemsFetched += 1;
                                        }
                                    );
                            } else if (!projectCollaborator?._id) {
                                this.contractsService.addProjectCollaborator(projectCollaborator)
                                    .pipe(
                                        takeUntil(
                                            this.destroy$
                                        )
                                    )
                                    .subscribe(
                                        (resp) => {
                                            if (resp['msg_code'] === '0001') {
                                                this.utilsService
                                                    .openSnackBarWithTranslate
                                                    ('general.contracts.check.collaborator.affected', null, 5000);

                                            } else {
                                                this.utilsService.openSnackBarWithTranslate('general.updated', null, 5000);

                                            }
                                        },
                                        error => {
                                            console.log('error', error);
                                        },
                                        () => {
                                            itemsFetched += 1;

                                        }
                                    );
                            }
                        }

                    } else {
                        if (this.selectedContractFile.name !== '') {
                            Contract.attachments = await this.uploadFile(this.selectedContractFile.file);
                        } else {
                            Contract.attachments = '';
                        }
                        if (!this.utilsService.checkDate(new Date(Contract.contract_start_date), new Date(Contract.contract_end_date))) {
                            this.utilsService.openSnackBarWithTranslate('general.contracts.check.date');
                        } else {
                            this.contractsService.addContract(Contract)
                                .pipe(
                                    takeUntil(this.destroy$)
                                )
                                .subscribe(
                                    async (response) => {
                                        for (const extension of this.contractExtensionInfo) {
                                            extension.application_id = Contract.application_id;
                                            extension.email_address = Contract.email_address;
                                            extension.contract_code = Contract.contract_code;
                                            if (extension.selectedExtensionFile?.name !== '' && extension.attachments) {
                                                extension.attachments = await this.uploadFile(extension.selectedExtensionFile?.file);
                                            }
                                            await this.contractsService.addContractExtension(extension)
                                                .pipe(
                                                    takeUntil(
                                                        this.destroy$
                                                    )
                                                )
                                                .subscribe(
                                                    async (res) => {

                                                    },
                                                    error => {
                                                        console.log('error', error);
                                                    },
                                                    () => {

                                                    }
                                                );
                                        }
                                        for (const project of this.contractProjectInfo) {
                                            project.application_id = Contract.application_id;
                                            project.company_email = Contract.email_address;
                                            project.contract_code = Contract.contract_code;
                                            await this.contractsService.addContractProject(project)
                                                .pipe(
                                                    takeUntil(
                                                        this.destroy$
                                                    )
                                                )
                                                .subscribe(
                                                    async (resp) => {
                                                        this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);

                                                    },
                                                    error => {
                                                        console.log('error', error);
                                                    },
                                                    () => {

                                                    }
                                                );
                                        }
                                        for (const projectCollaborator of this.projectCollaboratorInfo) {
                                            projectCollaborator.contract_code = Contract.contract_code;
                                            this.contractsService.addProjectCollaborator(projectCollaborator)
                                                .pipe(takeUntil(this.destroy$))
                                                .subscribe((resp1) => {
                                                    if (resp1['msg_code'] === '0001') {
                                                        this
                                                            .utilsService
                                                            .openSnackBarWithTranslate
                                                            ('general.contracts.check.collaborator.affected', null, 5000);
                                                    } else {
                                                        this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
                                                    }
                                                }, error => {
                                                    console.log('error', error);
                                                }, () => {
                                                });

                                        }
                                        this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);

                                    },
                                    (error) => {
                                        console.log(error);

                                    },
                                    () => {
                                        itemsFetched += 1;
                                    }
                                );
                        }

                    }
                }
            } else {
                this.utilsService.openSnackBarWithTranslate('general.contract.error.end.date', null, 5000);

            }
        } else {
            this.utilsService.openSnackBar('contract.error.exist.project.collaborator.project', null, 5000);
        }
    } else {
      this.utilsService.openSnackBar('general.contracts.missing.field', null, 5000);
    }

  }

  /**************************************************************************
   * @description ADD/Update Contract Extension to data table of DF
   * @param result
   * result.action: ['update', addMode]
   *************************************************************************/
  addInfo(result) {
    if (result.formGroupName === 'CONTRACT_EXTENSION') {
      const validatedField = ['extension_start_date', 'extension_end_date', 'extension_currency_cd', 'extension_status', 'extension_rate'];
      switch (result.action) {
        case 'update': {
          if (!this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_EXTENSION, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);
          } else {
            if (!this.utilsService.checkDate(new Date(this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value),
                new Date(this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value))) {
              this.utilsService.openSnackBarWithTranslate('general.contracts.ext.check.date', null, 5000);

            }  else if (!this.utilsService.checkDate(
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_start_date.value),
                new Date(this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value)
            )) {
              this.utilsService.openSnackBarWithTranslate('contracts.ext.date.invalid', null, 5000);
            }  else {
              this.contractExtensionInfo.forEach(
                  (element, index) => {
                    if ( ((element.contractExtensionKey ? element.contractExtensionKey.extension_code  : element.extension_code  ) ===
                            this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_code.value)
                        && (this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_EXTENSION, validatedField))
                    ) {
                      this.contractExtensionInfo[index].extension_start_date =
                          this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value;
                      this.contractExtensionInfo[index].extension_end_date =
                          this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value;
                      this.contractExtensionInfo[index].extension_rate
                          = this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value;
                      this.contractExtensionInfo[index].extension_status =
                          this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.value;
                      this.contractExtensionInfo[index].extension_currency_cd =
                          this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.value;
                      this.contractExtensionInfo[index].attachments = this.contractForm.controls.CONTRACT_EXTENSION['controls'].attachments.value;
                      this.contractExtensionInfo[index].selectedExtensionFile = this.selectedExtensionFile.pop();
                      this.contractExtensionInfo[index].updated = true;
                    }
                  }
              );
              this.contractForm.controls.CONTRACT_EXTENSION.reset();
              this.canUpdateAction.next(false);
              this.canAddAction.next(true);
            }

          }

        }
          break;
        case 'addMore': {
          if (!this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_EXTENSION, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);
          } else {
            if (!this.utilsService.checkDate(new Date(this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value),
                new Date(this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value))) {
              this.utilsService.openSnackBarWithTranslate('general.contracts.ext.check.date', null, 5000);

            }  else if (!this.utilsService.checkDate(
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_start_date.value),
                new Date(this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value)
            )) {
              this.utilsService.openSnackBarWithTranslate('contracts.ext.date.invalid', null, 5000);
            }  else {
              this.extensionsList.next([]);
              this.contractExtensionInfo.push(
                  {
                    extension_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-EXT`,
                    extension_start_date: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value,
                    extension_end_date: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value,
                    extension_rate: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value,
                    extension_currency_cd: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.value,
                    extension_status: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.value,
                    attachments: this.contractForm.controls.CONTRACT_EXTENSION['controls'].attachments.value,
                    selectedExtensionFile: this.selectedExtensionFile.pop(),
                  }
              );
              this.extensionsList.next(this.contractExtensionInfo.slice());
              this.contractForm.controls.CONTRACT_EXTENSION.reset();
              this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
            }

          }
        }
          break;
      }
    }
    if (result.formGroupName === 'CONTRACT_PROJECT' ) {
      const validatedField =
        ['start_date', 'project_desc', 'end_date', 'project_name', 'project_rate', 'project_status', 'rate_currency', 'vat_nbr'];
      const validatedFieldLength =
          ['project_desc'];
      switch (result.action) {
        case 'update': {
          if (!this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_PROJECT, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);

          } else if (
              !this.utilsService.checkFormGroupLength(this.contractForm.controls.CONTRACT_PROJECT, validatedFieldLength, 5, 100)
          ) {
            this.utilsService.openSnackBarWithTranslate('general.missing.length.invalid', null, 5000);

          } else {
            if (!this.utilsService.checkDate(new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].start_date.value),
                new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].end_date.value))) {
              this.utilsService.openSnackBarWithTranslate('contracts.project.date.invalid', null, 5000);

            } else if (!this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_PROJECT, validatedField)) {
              this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);
            } else if (
                !this.utilsService.checkDateBetweenTwoDate(new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].start_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_start_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_end_date.value)

            )) {
              this.utilsService.openSnackBarWithTranslate('contract.addcontract.check.date.contract.projet.start.date', null, 5000);
            } else if (!this.utilsService.checkDateBetweenTwoDate(
                new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].end_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_start_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_end_date.value)

            )) {
              this.utilsService.openSnackBarWithTranslate('contract.addcontract.check.date.contract.projet.end.date', null, 5000);
            } else {
              this.contractProjectInfo.forEach(
                  (element, index) => {
                    if ( ((element.ContractProjectKey ? element.ContractProjectKey.project_code : element.project_code  ) ===
                            this.contractForm.controls.CONTRACT_PROJECT['controls'].project_code.value)
                        && (this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_PROJECT, validatedField))

                    ) {
                      this.contractProjectInfo[index].start_date =
                          this.contractForm.controls.CONTRACT_PROJECT['controls'].start_date.value;
                      this.contractProjectInfo[index].project_desc =
                          this.contractForm.controls.CONTRACT_PROJECT['controls'].project_desc.value;
                      this.contractProjectInfo[index].end_date =
                          this.contractForm.controls.CONTRACT_PROJECT['controls'].end_date.value;
                      this.contractProjectInfo[index].project_name =
                          this.contractForm.controls.CONTRACT_PROJECT['controls'].project_name.value;
                      this.contractProjectInfo[index].vat_nbr =
                          this.contractForm.controls.CONTRACT_PROJECT['controls'].vat_nbr.value;
                      this.contractProjectInfo[index].category_code =
                          this.contractForm.controls.CONTRACT_PROJECT['controls'].category_code.value;
                      this.contractProjectInfo[index].project_rate = this.contractForm.controls.CONTRACT_PROJECT['controls'].project_rate.value;
                      this.contractProjectInfo[index].project_status = this.contractForm.controls.CONTRACT_PROJECT['controls'].project_status.value;
                      this.contractProjectInfo[index].rate_currency = this.contractForm.controls.CONTRACT_PROJECT['controls'].rate_currency.value;
                      this.contractProjectInfo[index].comment = this.contractForm.controls.CONTRACT_PROJECT['controls'].comment.value;
                      this.contractProjectInfo[index].updated = true;
                    }
                  }
              );
              this.contractForm.controls.CONTRACT_PROJECT.reset();
              this.canUpdateContractProjectAction.next(false);
              this.canAddContractProjectAction.next(true);
            }

          }

        }
          break;
        case 'addMore': {
          if (!this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_PROJECT, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);

          } else if (
              !this.utilsService.checkFormGroupLength(this.contractForm.controls.CONTRACT_PROJECT, validatedFieldLength, 5, 100)
          ) {
            this.utilsService.openSnackBarWithTranslate('general.missing.length.invalid', null, 5000);

          } else {
            if (!this.utilsService.checkDate(new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].start_date.value),
                new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].end_date.value))) {
              this.utilsService.openSnackBarWithTranslate('general.date.invalid', null, 5000);

            } else if (!this.utilsService.checkFormGroup(this.contractForm.controls.CONTRACT_PROJECT, validatedField)) {
              this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);
            } else if (!this.utilsService.checkDateBetweenTwoDate(
                new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].start_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_start_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_end_date.value)

            )) {
              this.utilsService.openSnackBarWithTranslate('contract.addcontract.check.date.contract.projet.start.date', null, 5000);
            } else if (!this.utilsService.checkDateBetweenTwoDate(
                new Date(this.contractForm.controls.CONTRACT_PROJECT['controls'].end_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_start_date.value),
                new Date(this.contractForm.controls.INFORMATION['controls'].contract_end_date.value)

            )) {
              this.utilsService.openSnackBarWithTranslate('contract.addcontract.check.date.contract.projet.end.date', null, 5000);
            } else {
              this.contractProjectList.next([]);
              this.contractProjectInfo.push(
                  {
                    project_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-PROJECT`,
                    start_date: this.contractForm.controls.CONTRACT_PROJECT['controls'].start_date.value,
                    category_code: this.contractForm.controls.CONTRACT_PROJECT['controls'].category_code.value,
                    end_date: this.contractForm.controls.CONTRACT_PROJECT['controls'].end_date.value,
                    project_rate: this.contractForm.controls.CONTRACT_PROJECT['controls'].project_rate.value,
                    project_desc: this.contractForm.controls.CONTRACT_PROJECT['controls'].project_desc.value,
                    vat_nbr: this.contractForm.controls.CONTRACT_PROJECT['controls'].vat_nbr.value,
                    project_name: this.contractForm.controls.CONTRACT_PROJECT['controls'].project_name.value,
                    rate_currency: this.contractForm.controls.CONTRACT_PROJECT['controls'].rate_currency.value ,
                    project_status: this.contractForm.controls.CONTRACT_PROJECT['controls'].project_status.value,
                    comment: this.contractForm.controls.CONTRACT_PROJECT['controls'].comment.value,
                  }
              );
              this.contractProjectList.next(this.contractProjectInfo.slice());
              this.projectList.next([]);
              this.projectList.next(
                  this.contractProjectInfo.map(
                      (obj) => {
                        return { value: obj.ContractProjectKey?.project_code ? obj.ContractProjectKey.project_code :
                              obj.project_code
                          , viewValue: obj.project_name  };
                      }
                  )
              );
              this.contractForm.controls.CONTRACT_PROJECT.reset();
              this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
            }

          }
        }
          break;
      }
    }
    if (result.formGroupName === 'PROJECT_COLLABORATOR') {
      const validatedField =
        ['start_date', 'project_code', 'email_address', 'end_date'];
      const project = this.contractProjectInfo
          .filter(x => (x.project_code === this.contractForm.controls.PROJECT_COLLABORATOR['controls'].project_code.value)
          || (x.ContractProjectKey?.project_code === this.contractForm.controls.PROJECT_COLLABORATOR['controls'].project_code.value)
          )[0];

      switch (result.action) {
        case 'update': {
          if (!this.utilsService.checkFormGroup(this.contractForm.controls.PROJECT_COLLABORATOR, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);
          } else {
            if (!this.utilsService.checkDate(new Date(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].start_date.value),
                new Date(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].end_date.value))) {
              this.utilsService.openSnackBarWithTranslate('general.date.invalid', null, 5000);

            } else if (!this.utilsService.checkFormGroup(this.contractForm.controls.PROJECT_COLLABORATOR, validatedField)) {
              this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);
            } else if (!this.utilsService.checkDateBetweenTwoDate(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].start_date.value,
                project.start_date,
                project.end_date

                )) {
              this.utilsService.openSnackBarWithTranslate('general.contracts.project.collaborator.check.date', null, 5000);
            } else if (!this.utilsService.checkDateBetweenTwoDate(
                new Date(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].end_date.value),
                new Date(project.start_date),
                new Date(project.end_date)

            )) {
              this.utilsService.openSnackBarWithTranslate('general.contracts.project.collaborator.check.date', null, 5000);
            } else {
              this.projectCollaboratorInfo.forEach(
                  (element, index) => {
                    if (( (element.ProjectCollaboratorKey ? element.ProjectCollaboratorKey.project_code : element.project_code  ) ===
                            this.contractForm.controls.PROJECT_COLLABORATOR['controls'].project_code.value) &&
                        ( (element.ProjectCollaboratorKey ? element.ProjectCollaboratorKey.email_address : element.email_address  ) ===
                            this.contractForm.controls.PROJECT_COLLABORATOR['controls'].email_address.value)
                        && (this.utilsService.checkFormGroup(this.contractForm.controls.PROJECT_COLLABORATOR, validatedField))
                    ) {
                      this.projectCollaboratorInfo[index].start_date =
                          this.contractForm.controls.PROJECT_COLLABORATOR['controls'].start_date.value;
                      this.projectCollaboratorInfo[index].project_code =
                          this.contractForm.controls.PROJECT_COLLABORATOR['controls'].project_code.value;
                      this.projectCollaboratorInfo[index].contract_code = this.contractInfo.contractKey.contract_code;
                      this.projectCollaboratorInfo[index].email_address =
                          this.contractForm.controls.PROJECT_COLLABORATOR['controls'].email_address.value;
                      this.projectCollaboratorInfo[index].end_date =
                          this.contractForm.controls.PROJECT_COLLABORATOR['controls'].end_date.value;
                      this.projectCollaboratorInfo[index].updated = true;
                    }
                  }
              );
              this.contractForm.controls.PROJECT_COLLABORATOR.reset();
              this.canUpdateContractProjectAction.next(false);
              this.canAddContractProjectAction.next(true);
            }

          }

        }
          break;
        case 'addMore': {
          if (!this.utilsService.checkFormGroup(this.contractForm.controls.PROJECT_COLLABORATOR, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', null, 5000);
          } else {
            if (!this.utilsService.checkDate(
                new Date(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].start_date.value),
                new Date(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].end_date.value))) {
              this.utilsService.openSnackBarWithTranslate('general.date.invalid', null, 5000);

            } else if (this.checkProjectByCollaborator(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].project_code.value,
                this.contractForm.controls.PROJECT_COLLABORATOR['controls'].email_address.value
                )) {
              this.utilsService.openSnackBarWithTranslate('general.project.no.add', null, 5000);
            } else if (!this.utilsService.checkDateBetweenTwoDate(
                new Date(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].start_date.value),
                new Date(project.start_date),
                new Date(project.end_date)

            )) {
              this.utilsService.openSnackBarWithTranslate('general.contracts.project.collaborator.check.date', null, 5000);
            } else if (!this.utilsService.checkDateBetweenTwoDate(
                new Date(this.contractForm.controls.PROJECT_COLLABORATOR['controls'].end_date.value),
                new Date(project.start_date),
                new Date(project.end_date)

            )) {
              this.utilsService.openSnackBarWithTranslate('general.contracts.project.collaborator.check.date', null, 5000);
            } else {
              this.projectCollaboratorList.next([]);
              this.projectCollaboratorInfo.push(
                  {
                    project_code: this.contractForm.controls.PROJECT_COLLABORATOR['controls'].project_code.value,
                    start_date: this.contractForm.controls.PROJECT_COLLABORATOR['controls'].start_date.value,
                    end_date: this.contractForm.controls.PROJECT_COLLABORATOR['controls'].end_date.value,
                    email_address: this.contractForm.controls.PROJECT_COLLABORATOR['controls'].email_address.value,
                    contract_code: this.contractForm.controls.INFORMATION['controls'].contractor_code.value

                  }
              );
              this.projectCollaboratorList.next(this.projectCollaboratorInfo.slice());
              this.contractForm.controls.PROJECT_COLLABORATOR.reset();
              this.utilsService.openSnackBarWithTranslate('general.add', null, 5000);
            }

          }

        }
          break;
      }
    }

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
        case ('update'): this.setContractExtension(rowAction);
          break;
        case('delete'):   this.onStatusChange(rowAction);
      }

  }

  /**************************************************************************
   * @description get rowData
   * update form with row details
   *************************************************************************/
  setContractExtension(row) {
    if (row.formGroupName === 'CONTRACT_EXTENSION') {
      this.canAddAction.next(false);
      this.canUpdateAction.next(true);
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_code.setValue(
        row.data.contractExtensionKey?.extension_code ? row.data.contractExtensionKey?.extension_code : row.data.extension_code);
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.setValue(row.data.extension_start_date);
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.setValue(row.data.extension_end_date);
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.setValue(row.data.extension_rate);
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.setValue(
        row.data.extension_currency_cd
      );
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.setValue(
          row.data.extension_status);
      this.contractForm.controls.CONTRACT_EXTENSION['controls'].attachments.setValue(row.data.attachments);
    } else if ( row.formGroupName === 'CONTRACT_PROJECT' ) {
      console.log('my data ', row.data);
      this.canAddContractProjectAction.next(false);
      this.canUpdateContractProjectAction.next(true);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].project_code.setValue(
        row.data.ContractProjectKey?.project_code ? row.data.ContractProjectKey?.project_code : row.data.project_code);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].start_date.setValue(row.data.start_date);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].category_code.setValue(row.data.category_code);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].end_date.setValue(row.data.end_date);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].project_rate.setValue(row.data.project_rate);
     this.contractForm.controls.CONTRACT_PROJECT['controls'].vat_nbr.setValue(row.data.vat_nbr);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].project_name.setValue(row.data.project_name);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].comment.setValue(row.data.comment);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].project_desc.setValue(row.data.project_desc);
      this.contractForm.controls.CONTRACT_PROJECT['controls'].rate_currency.setValue(
        row.data.rate_currency
      );
      this.contractForm.controls.CONTRACT_PROJECT['controls'].project_status.setValue(
          row.data.project_status);
    } else if ( row.formGroupName === 'PROJECT_COLLABORATOR' ) {
      this.canAddProjectCollaboratorAction.next(false);
      this.canUpdateProjectCollaboratorAction.next(true);
      this.contractForm.controls.PROJECT_COLLABORATOR['controls'].project_code.setValue(
        row.ProjectCollaboratorKey?.project_code ? row.ProjectCollaboratorKey?.project_code : row.data.project_code);
      this.contractForm.controls.PROJECT_COLLABORATOR['controls'].email_address.setValue(
        row.ProjectCollaboratorKey?.email_address ? row.ProjectCollaboratorKey?.email_address : row.data.email_address);
      this.contractForm.controls.PROJECT_COLLABORATOR['controls'].start_date.setValue(
        row.data.start_date);
      this.contractForm.controls.PROJECT_COLLABORATOR['controls'].end_date.setValue(
        row.data.end_date);
    }

  }

  /**************************************************************************
   * @description Check if URL contains the ID og
   *************************************************************************/
  canUpdate(_id: any): boolean {
    return _id && _id !== '';
  }

  /**************************************************************************
   * @description Upload Image to Server  with async to promise
   *************************************************************************/
  async uploadFile(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        takeUntil(this.destroy$),
        map(response => response.file.filename)
      )
      .toPromise();
  }

  /**************************************************************************
   * @description : GET the name of document and update form field value
   *************************************************************************/
  async getFileNameAndUpdateForm(id, formGroupName) {
      await this.uploadService.getFilesByName(id).subscribe(
        (data) => {
          if (formGroupName === 'INFORMATION') {
            this.contractForm.patchValue( {
                INFORMATION: {
                  attachments: data[0]?.caption
                }
              }
            );
          }
        },
          error => {
          console.log(error);
        });
  }

  /**************************************************************************
   * @description : GET the name of document and return it
   *************************************************************************/
  async getFileNameAsString(id) {
    return  this.uploadService.getFilesByName(id)
      .pipe(
        map(data => data[0]?.caption)
      )
      .toPromise();
  }

  /**************************************************************************
   * @description : detect change made by DF to files
   *************************************************************************/
  getFile(obj) {
    obj.forEach(
      (doc) => {
        if (doc.formGroupName === 'INFORMATION') {
          this.selectedContractFile.file = doc.data;
          this.selectedContractFile.name = doc.name;
          this.contractForm.patchValue(
            {
              INFORMATION: {
                attachments: doc.name,
              },
            }
          );
        } else if (doc.formGroupName === 'CONTRACT_EXTENSION') {
          this.selectedExtensionFile.push({ file: doc.data, name: doc.name});
          this.contractForm.patchValue(
            {
              CONTRACT_EXTENSION: {
                attachments: doc.name,
              },
            }
          );
        }
      }
    );
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    // Unsubscribe from subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  /**************************************************************************
   * @description delete and confirm function from datatable
   *************************************************************************/
  onStatusChange(row) {
    const confirmation = {
      code: 'delete',
      title: 'contracts.supp.extprojetcontrat.deleteinfo',
      description: `contracts.supp.extprojetcontrat.deleteinfo.msg`,
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          let code = '';
           let index = 0;
          let element = null;
          let email = '';
          if (res === true) {
            if (row.formGroupName === 'CONTRACT_EXTENSION') {
              code = row.data.contractExtensionKey?.extension_code ? row.data.contractExtensionKey?.extension_code : row.data.extension_code;
              element = this.contractExtensionInfo.filter(x => x.contractExtensionKey?.extension_code === code || x.extension_code === code)[0];
              index = this.contractExtensionInfo.indexOf(element);
              if (index !== -1) {
                this.contractExtensionInfo.splice(index, 1);
                this.extensionsList.next(this.contractExtensionInfo.slice());
                if (row.data._id) {
                  this.contractsService.deleteContractExtension(row.data._id).subscribe((res1) => {
                    this.utilsService.openSnackBarWithTranslate('general.remove', null, 5000);

                  }, (err) => { this.utilsService.openSnackBarWithTranslate('something wrong', null, 5000); });

                } else {
                  this.utilsService.openSnackBarWithTranslate('general.remove', null, 5000);

                }
              }

            } else if (row.formGroupName === 'CONTRACT_PROJECT') {
              code = row.data.ContractProjectKey?.project_code ? row.data.ContractProjectKey?.project_code : row.data.project_code;
              element = this.contractProjectInfo.filter(x => x.ContractProjectKey?.project_code === code || x.project_code === code)[0];
              index = this.contractProjectInfo.indexOf(element);
              if (index !== -1) {
                if (!this.checkProjectExist(code)) {
                  this.contractProjectInfo.splice(index, 1);
                  this.contractProjectList.next(this.contractProjectInfo.slice());
                  this.projectList.next([]);
                  this.projectList.next(
                    this.contractProjectInfo.map(
                      (obj) => {
                        return { value: obj.ContractProjectKey?.project_code ? obj.ContractProjectKey.project_code :
                            obj.project_code
                          , viewValue: obj.project_name };
                      }
                    )
                  );
                  if ((row.data._id)) {
                    this.contractsService.deleteContractProject(row.data._id).subscribe((res1) => {
                      this.utilsService.openSnackBarWithTranslate('general.remove', null, 5000);

                    }, (err) => { this.utilsService.openSnackBarWithTranslate('general.contracts.project.error', null, 5000); });

                  } else {
                    this.utilsService.openSnackBarWithTranslate('general.remove', null, 5000);

                  }
                } else {
                  this.utilsService.openSnackBarWithTranslate('general.contracts.check.collaborator.affected', null, 5000);

                }

              }

            } else if (row.formGroupName === 'PROJECT_COLLABORATOR') {
              code = row.data.ProjectCollaboratorKey?.project_code ? row.data.ProjectCollaboratorKey?.project_code : row.data.project_code;
              email = row.data.ProjectCollaboratorKey?.email_address ? row.data.ProjectCollaboratorKey?.email_address : row.data.email_address;
              element = this.projectCollaboratorInfo
                  .filter(x => (x.ContractProjectKey?.project_code === code || x.project_code === code)
                      && (x.ContractProjectKey?.email_address === email || x.email_address === email))[0];
              index = this.projectCollaboratorInfo.indexOf(element);
              if (index !== -1) {
                this.projectCollaboratorInfo.splice(index, 1);
                this.projectCollaboratorList.next(this.projectCollaboratorInfo.slice());
                if (row.data._id) {
                  this.contractsService.deleteProjectCollaborator(row.data._id).subscribe((res1) => {
                    this.utilsService.openSnackBarWithTranslate('general.remove', null, 5000);

                  }, (err) => { this.utilsService.openSnackBarWithTranslate('general.contracts.project.collaborator.error', null, 5000); });

                } else {
                  this.utilsService.openSnackBarWithTranslate('general.remove', null, 5000);

                }
              }

            }
          }

        });
  }

  /**
   * @description disable contract extension
   */
  disableContractExtension() {
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.disable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.disable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.disable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.disable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.disable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].attachments.disable();
  }
  /**
   * @description disable contract extension
   */
  enableContractExtension() {
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.enable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.enable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.enable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.enable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.enable();
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].attachments.enable();
  }
  /**************************************************************************
   * @description check project affected to collaborator
   *************************************************************************/
  checkProjectExist(project_code: any): boolean {
    let element = null;
    element = this.projectCollaboratorInfo.filter(x => x.ContractProjectKey?.project_code === project_code || x.project_code === project_code )[0];

    if (element !== null && element !== undefined) {
      return true;
    }
    return false;

  }

  /**
   * @description verify dates of contract extension
   */
  verifyDatesContractExtension(dateContract: Date): boolean {
    return this.contractExtensionInfo.every(x => new Date(x.extension_start_date).getTime() > new Date(dateContract).getTime());
  }
  /**
   * @description verify dates of contract extension
   */
  verifyDatesProjectContract(dateContract: Date): boolean {
    return this.contractProjectInfo.every(x => new Date(x.end_date).getTime() < new Date(dateContract).getTime());
  }

  /**
   * @description check project by collaborator
   */
  checkProjectByCollaborator(project_code: any, email: any): boolean {
    let element = null;
    element = this.projectCollaboratorInfo
        .filter(x =>
            (x.ContractProjectKey?.project_code === project_code || x.project_code === project_code)
            && (x.ContractProjectKey?.email_address === email || x.email_address === email) )[0];
    if (element !== null && element !== undefined) {
      return true;
    }
    return false;

  }

  /**
   * @description get contractor status
   */
  async getContractorStatus(type: string) {
    if (type === 'CLIENT') {
       const element = this.statusList.value.filter(x => x.value === 'SUP_SIGN')[0];
       const i = this.statusList.value.indexOf(element);
       this.statusList.value.splice(i, 1);
      this.statusList.next(this.refDataService.refData['CONTRACT_STATUS']);
      this.filteredStatus.next(this.statusList.value);
      this.utilsService.changeValueField(this.statusList.value,
          this.contractForm.controls.INFORMATION['controls'].contractStatusFilter,
          this.filteredStatus
      );
    }
    if (type === 'SUPPLIER') {
      const element = this.statusList.value.filter(x => x.value === 'CUST_SIGN')[0];
      const i = this.statusList.value.indexOf(element);
      this.statusList.value.splice(i, 1);
      this.statusList.next(this.refDataService.refData['CONTRACT_STATUS']);
      this.filteredStatus.next(this.statusList.value);
      this.utilsService.changeValueField(this.statusList.value,
          this.contractForm.controls.INFORMATION['controls'].contractStatusFilter,
          this.filteredStatus
      );
    }
  }
}
