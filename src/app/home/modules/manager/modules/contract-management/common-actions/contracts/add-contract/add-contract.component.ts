import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { ICompanyPaymentTermsModel } from '@shared/models/companyPaymentTerms.model';
import { IContract } from '@shared/models/contract.model';
import { IContractExtension } from '@shared/models/contractExtension.model';
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
import { IContractorContact } from '@shared/models/contractorContact.model';

@Component({
  selector: 'wid-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit, OnDestroy {

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
  collaboratorList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  staffList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  contractorContacts: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  contractExtensionInfo = [];
  extensionsList: BehaviorSubject<any> = new BehaviorSubject<any>(this.contractExtensionInfo);
  canUpdateAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  companyTimesheet: ICompanyTimesheetSettingModel;
  /**************************************************************************
   * @description Declaring Form Group
   *************************************************************************/
  contractForm: FormGroup;

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
   * @description Menu Items List
   *************************************************************************/
  contractItems: IDynamicMenu[] = [
    {
      title: 'Contract',
      titleKey: 'CONTRACT',
      child: [
        {
          title: 'Information',
          titleKey: 'INFORMATION',
        },
        {
          title: 'Signer',
          titleKey: 'SIGNER',
        },
        {
          title: 'Rate',
          titleKey: 'RATE',
        },
        {
          title: 'TimeSheet',
          titleKey: 'TIMESHEET',
        }
      ]
    },
    {
      title: 'Contract Extension',
      titleKey: 'CONTRACT_EXTENSION',
      child: []
    },
  ];
  dynamicForm: BehaviorSubject<IDynamicForm[] > = new BehaviorSubject<IDynamicForm[]>([
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Contractor name',
          placeholder: 'Contractor code',
          type: FieldsType.SELECT,
          selectFieldList: this.contractorsList,
          formControlName: 'contractor_code'
        },
        {
          label: 'Collaborator email',
          placeholder: 'Collaborator email',
          type: FieldsType.SELECT,
          selectFieldList: this.collaboratorList,
          formControlName: 'collaborator_email'
        },
      ],
    },
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Start date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'contract_start_date'
        },
        {
          label: 'End date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'contract_end_date',
          minDate: this.minDate,
        },
      ],
    },
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Status',
          placeholder: 'Status',
          type: FieldsType.SELECT,
          selectFieldList: this.statusList,
          formControlName: 'contract_status'
        },
        {
          label: 'Attachments',
          placeholder: 'File',
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
          label: 'Company signer',
          placeholder: 'exp@email.com',
          type: FieldsType.SELECT,
          selectFieldList: this.staffList,
          formControlName: 'signer_company_email',
        },
        {
          label: 'Contractor signer',
          placeholder: 'exp@email.com',
          type: FieldsType.SELECT,
          selectFieldList: this.contractorContacts,
          formControlName: 'signer_contractor_email',
        },
      ],
    },
    {
      titleRef: 'SIGNER',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Company signature date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'signature_company_date',
        },
        {
          label: 'Contractor signature date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'signature_contractor_date',
        },
      ],
    },
    {
      titleRef: 'RATE',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'contract_rate',
        },
        {
          label: 'Currency',
          placeholder: 'Currency',
          type: FieldsType.SELECT,
          selectFieldList: this.currencyList,
          formControlName: 'currency_cd',
        },
      ],
    },
    {
      titleRef: 'RATE',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'Payment',
          placeholder: 'Payment',
          type: FieldsType.SELECT,
          selectFieldList: this.paymentTermsList,
          formControlName: 'payment_terms',
        },
      ],
    },
    {
      titleRef: 'TIMESHEET',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Working hour day',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'working_hour_day',
        },
        {
          label: 'Holiday rate',
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
          label: 'Saturday rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'saturday_rate',
        },
        {
          label: 'Sunday rate',
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
              'extension_rate', 'extension_currency_cd', 'extension_status',
              'Actions'],
            columns: [
              { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
              { name: 'Start Date', prop: 'extension_start_date', type: InputType.TEXT},
              { name: 'End date', prop: 'extension_end_date', type: InputType.TEXT},
              { name: 'Rate', prop: 'extension_rate', type: InputType.TEXT},
              { name: 'Currency', prop: 'extension_currency_cd', type: InputType.TEXT},
              { name: 'Status', prop: 'extension_status', type: InputType.TEXT},
              { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
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
          label: 'Start date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'extension_start_date',
        },
        {
          label: 'End date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.DATE_PICKER,
          formControlName: 'extension_end_date',
        },
      ],
    },
    {
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Rate',
          placeholder: '0.00',
          type: FieldsType.INPUT,
          inputType: InputType.NUMBER,
          formControlName: 'extension_rate',
        },
        {
          label: 'Currency',
          placeholder: 'Currency',
          type: FieldsType.SELECT,
          selectFieldList: this.currencyList,
          formControlName: 'extension_currency_cd',
        },
      ],
    },
    {
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'Status',
          placeholder: 'Status',
          type: FieldsType.SELECT,
          selectFieldList: this.statusList,
          formControlName: 'extension_status',
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
  ]);

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  private subscriptions: Subscription[] = [];

  /**************************************************************************
   * @description list of Data filtered by search keyword
   *************************************************************************/
  public filteredCurrencies: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);

  avatar: any;
  selectedFile = { file: FormData, name: ''};

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
  ) {
    this.contractForm = new FormGroup({ });
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
 async ngOnInit() {
    this.initContractForm(null, null);
   await this.getInitialData();
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(params => {
        if (this.canUpdate(params.id)) {
          this.contractId = params.id;
          this.getContractByID(params);
        }
      });
    this.sheetService.registerSheets(
      [
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent},
      ]);
    this.contractForm.get('INFORMATION').valueChanges.subscribe(selectedValue => {
      selectedValue.contractor_code !== '' ?
        this.getContractorContact(selectedValue.contractor_code).then(
          (data) => {
            this.contractorContacts.next(data);
            this.dynamicForm.getValue()[3].fields[1] = {
              label: 'Contractor signer',
              placeholder: 'exp@email.com',
              type: FieldsType.SELECT,
              selectFieldList: this.contractorContacts,
              formControlName: 'signer_contractor_email',
          };
          }) :
        this.dynamicForm.getValue()[3].fields[1] = {
          label: 'Contractor signer',
          placeholder: 'exp@email.com',
          type: FieldsType.SELECT,
          selectFieldList: this.contractorContacts,
          formControlName: 'signer_contractor_email',
        };
      selectedValue.contract_start_date !== '' ? this.minDate.next(new Date(selectedValue.contract_start_date)) : this.minDate.next('');
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
 async getInitialData() {
  const cred = this.localStorageService.getItem('userCredentials');
  this.applicationId = cred['application_id'];
    /************ get currencies List and next the value to the subject ************/
    /********************************** CURRENCY **********************************/
    this.currencyList.next(this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC};
    }));
    this.subscriptions.push(
      await this.userService.connectedUser$.subscribe((data) => {
        if (!!data) {
          this.userInfo = data;
          this.companyEmail = data.user[0]['company_email'];
          this.getPaymentTerms();
          this.getTimeSheetSettings();
        }
      }),
      await this.profileService.getAllUser(this.companyEmail)
        .subscribe((res) => {
          this.collaboratorList.next(
            res.filter(value => value.user_type === 'COLLABORATOR').map(
              (obj) => {
                return { value: obj.userKey.email_address, viewValue: obj.first_name + ' ' + obj.last_name };
              }
            )
          );
          this.staffList.next(res.filter(value => value.user_type === 'STAFF').map(
            (obj) => {
              return { value: obj.userKey.email_address, viewValue: obj.first_name + ' ' + obj.last_name };
            }
            )
          );
        })
    );
    /*---------------------------------------------------------------*/
   await this.refDataService.getRefData(
      this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
      this.applicationId,
      ['LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES']
    );
    this.statusList.next(this.refDataService.refData['CONTRACT_STATUS']);
    this.contractorService
      .getContractors(`?contractor_type=${this.type}&email_address=${this.companyEmail}`)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          this.contractors = res;
          this.contractorsList.next(
            res.map(
              (obj) => {
                return { value: obj.contractorKey.contractor_code, viewValue: obj.contractor_name };
              }
            )
          );
        },
        (error) => {
          console.log(error);
        },
      );
  }

  /* Init Contract Form*/
  async initContractForm(contract: IContract, contractExtension: IContractExtension) {
    this.contractForm = this.formBuilder.group({
      INFORMATION: this.formBuilder.group({
        contractor_code: [contract === null ? '' : contract.contractor_code, Validators.required],
        collaborator_email: [contract === null ? '' : contract.collaborator_email, [Validators.required, Validators.email]],
        contract_date: [contract === null ? '' : contract.contract_date],
        contract_start_date: [contract === null ? '' : contract.contract_start_date],
        contract_end_date: [contract === null ? '' : contract.contract_end_date],
        contract_status: [contract === null ? '' : contract.contract_status],
        attachments: [contract === null ? '' : await this.getFileName(contract.attachments)],
      }),
      SIGNER: this.formBuilder.group({
        signer_company_email: [contract === null ? '' : contract.signer_company_email],
        signer_contractor_email: [contract === null ? '' : contract.signer_contractor_email],
        signature_company_date: [contract === null ? '' : contract.signature_company_date],
        signature_contractor_date: [contract === null ? '' : contract.signature_contractor_date],
      }),
      RATE: this.formBuilder.group({
        contract_rate: [contract === null ? '' : contract.contract_rate, Validators.required],
        currency_cd: [contract === null ? '' : contract.currency_cd],
        payment_terms: [contract === null ? '' : contract.payment_terms],
        filterCurrencyControl: [''],
        paymentTermsControl: [''],
      }),
      TIMESHEET: this.formBuilder.group({
        working_hour_day: [contract === null ? '' : contract.working_hour_day],
        holiday_rate: [contract === null ? '' : contract.holiday_rate],
        saturday_rate: [contract === null ? '' : contract.saturday_rate],
        sunday_rate: [contract === null ? '' : contract.sunday_rate],
      }),
      CONTRACT_EXTENSION: this.formBuilder.group({
        extension_code: [''],
        extension_start_date: [''],
        extension_end_date: [''],
        extension_status: [''],
        extension_rate: ['', Validators.required],
        extension_currency_cd: [''],
      }),
    });
  }

  /**************************************************************************
   * @description Get Contractor to be updated
   *************************************************************************/
  getContractByID(params) {
    forkJoin([
      this.contractsService.getContracts(`?_id=${atob(params.id)}`),
      this.contractsService.getContractExtension(`?contractor_code=${atob(params.cc)}&email_address=${atob(params.ea)}`)
    ])
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        (res) => {
          this.contractInfo = res[0][0];
          this.contractExtensionInfo = res[1];
          this.initContractForm(this.contractInfo, this.contractExtensionInfo[0]);
          this.contractExtensionInfo.map(
            (extension) => {
              extension.extension_currency_cd = this.appInitializerService.currenciesList.find((type) =>
                type.CURRENCY_CODE === extension.extension_currency_cd).CURRENCY_DESC;
              extension.extension_status = this.refDataService.refData['CONTRACT_STATUS'].find((type) =>
                type.value === extension.extension_status).viewValue;
            }
          );
          this.extensionsList.next(this.contractExtensionInfo.slice()
          );
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
  getPaymentTerms() {
    this.companyPaymentTermsService.getCompanyPaymentTerms(this.companyEmail)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (companyPaymentTerms) => {
          this.paymentTermsList.next(
            companyPaymentTerms.map(
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
            resolve(
              Contacts.map(
                (obj) => {
                  return { value: obj.contractorContactKey.contractor_code, viewValue: obj.main_contact};
                }
              )
            );
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

  /**
   * @description Create New Contract
   */
  async createNewContract(data: FormGroup) {
    const Contract = {
      ...this.contractForm.controls.INFORMATION.value,
      ...this.contractForm.controls.SIGNER.value,
      ...this.contractForm.controls.RATE.value,
      ...this.contractForm.controls.TIMESHEET.value,
      ...this.contractForm.controls.CONTRACT_EXTENSION.value,
    };
    Contract.application_id = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.application_id : this.userInfo.company[0].companyKey.application_id;
    Contract.contract_code = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.contract_code : `${Math.random().toString(36).substring(7).toUpperCase()}`;
    Contract.email_address = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.email_address : this.userInfo.company[0].companyKey.email_address;
/*    Contract.extension_code = this.canUpdate(this.contractId) ?
      this.contractExtensionInfo.contractExtensionKey.extension_code : `${Math.random().toString(36).substring(7).toUpperCase()}`;*/
    Contract.contract_type = this.type;
    Contract.contract_date = Date.now();
    Contract.attachments = this.canUpdate(this.contractId) ?
      this.contractInfo.attachments : await this.uploadFile(this.selectedFile.file);
    if (this.canUpdate(this.contractId)) {

      this.contractsService.updateContract(Contract)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (res) => {
            console.log('updated successfully', res);
            if (this.type === 'CLIENT') {
              this.router.navigate(
                ['/manager/contract-management/clients-contracts/contracts-list']);
            } else if (this.type === 'SUPPLIER') {
              this.router.navigate(
                ['/manager/contract-management/suppliers-contracts/contracts-list']);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      this.contractExtensionInfo.forEach(
        (extension) => {
          extension.application_id = Contract.application_id;
          extension.email_address = Contract.email_address;
          extension.contract_code = Contract.contract_code;
          extension.extension_currency_cd = this.appInitializerService.currenciesList.find((type) =>
            type.CURRENCY_DESC === extension.extension_currency_cd).CURRENCY_CODE;
          extension.extension_status = this.refDataService.refData['CONTRACT_STATUS'].find((type) =>
            type.viewValue === extension.extension_status).value;
          if (extension._id && extension?.updated) {
            this.contractsService.updateContractExtension(extension)
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
                      ['/manager/contract-management/clients-contracts/contracts-list']);
                  } else if (this.type === 'SUPPLIER') {
                    this.router.navigate(
                      ['/manager/contract-management/suppliers-contracts/contracts-list']);
                  }
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
                  console.log('resp', resp);
                },
                error => {
                  console.log('error', error);
                },
                () => {
                  if (this.type === 'CLIENT') {
                    this.router.navigate(
                      ['/manager/contract-management/clients-contracts/contracts-list']);
                  } else if (this.type === 'SUPPLIER') {
                    this.router.navigate(
                      ['/manager/contract-management/suppliers-contracts/contracts-list']);
                  }
                }
              );
          }
        }
      );
    } else {
      this.contractsService.addContract(Contract)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('added successfully', response);
            if (this.type === 'CLIENT') {
              this.router.navigate(
                ['/manager/contract-management/clients-contracts/contracts-list']);
            } else if (this.type === 'SUPPLIER') {
              this.router.navigate(
                ['/manager/contract-management/suppliers-contracts/contracts-list']);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      this.contractExtensionInfo.forEach(
        (extension) => {
          extension.application_id = Contract.application_id;
          extension.email_address = Contract.email_address;
          extension.contract_code = Contract.contract_code;
          extension.extension_currency_cd = this.appInitializerService.currenciesList.find((type) =>
            type.CURRENCY_DESC === extension.extension_currency_cd).CURRENCY_CODE;
          extension.extension_status = this.refDataService.refData['CONTRACT_STATUS'].find((type) =>
            type.viewValue === extension.extension_status).value;
          this.contractorService.addContractorContact(extension)
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
                    ['/manager/contract-management/clients-contracts/contracts-list']);
                } else if (this.type === 'SUPPLIER') {
                  this.router.navigate(
                    ['/manager/contract-management/suppliers-contracts/contracts-list']);
                }
              }
            );
        }
      );
    }
  }

  /**************************************************************************
   * @description Create/Update New/Old Contractor Contact
   * @param result
   * result.action: ['update', addMode]
   *************************************************************************/
  addContractExtension(result) {
    switch (result.action) {
      case 'update': {
        this.contractExtensionInfo.forEach(
          (element, index) => {
            if ( (element.contractExtensionKey ? element.contractExtensionKey.extension_code  : element.extension_code  ) ===
              this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_code.value) {
              this.contractExtensionInfo[index].extension_start_date =
                this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value;
              this.contractExtensionInfo[index].extension_end_date =
                this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value;
              this.contractExtensionInfo[index].extension_rate = this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value;
              this.contractExtensionInfo[index].extension_status = this.refDataService.refData['CONTRACT_STATUS'].find((type) =>
                type.value === this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.value).viewValue;
              this.contractExtensionInfo[index].extension_currency_cd = this.appInitializerService.currenciesList.find((type) =>
                type.CURRENCY_CODE === this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.value).CURRENCY_DESC;
              this.contractExtensionInfo[index].updated = true;
            }
          }
        );
        this.contractForm.patchValue(
          {
            CONTRACT_EXTENSION: {
              extension_code: '',
              extension_start_date: '',
              extension_end_date: '',
              extension_rate: '',
              extension_status: '',
              extension_currency_cd: '',
            },
          }
        );
        this.canUpdateAction.next(false);
        this.canAddAction.next(true);
      }
        break;
      case 'addMore': {
        if (
          !this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value &&
          this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value === '' ) {
        } else {
          this.extensionsList.next([]);
          this.contractExtensionInfo.push(
            {
              extension_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-EXT`,
              extension_start_date: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value,
              extension_end_date: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value,
              extension_rate: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value,
              extension_currency_cd: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd?.value ?
                this.appInitializerService.currenciesList.find((type) =>
                  type.CURRENCY_CODE === this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.value).CURRENCY_DESC : '',
              extension_status: this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status?.value ?
                this.refDataService.refData['CONTRACT_STATUS'].find((type) =>
                type.value === this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.value).viewValue : '',
            }
          );
          this.extensionsList.next(this.contractExtensionInfo.slice());
          this.contractForm.patchValue(
            {
              CONTRACT_EXTENSION: {
                extension_code: '',
                extension_start_date: '',
                extension_end_date: '',
                extension_rate: '',
                extension_status: '',
                extension_currency_cd: '',
              },
            }
          );
          this.utilsService.openSnackBar('Extension Added', 'close');
        }
      }
        break;
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
      case ('update'): this.setContractExtension(rowAction.data);
        break;
      case('delete'):  // this.onStatusChange(rowAction.data);
    }
  }

  /**************************************************************************
   * @description get rowData
   * update form with row details
   *************************************************************************/
  setContractExtension(row) {
    this.canAddAction.next(false);
    this.canUpdateAction.next(true);
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_code.setValue(
      row.contractExtensionKey?.extension_code ? row.contractExtensionKey?.extension_code : row.extension_code);
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.setValue(row.extension_start_date);
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.setValue(row.extension_end_date);
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.setValue(row.extension_rate);
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.setValue(
      this.appInitializerService.currenciesList.find((type) =>
        type.CURRENCY_DESC === row.extension_currency_cd).CURRENCY_CODE);
    this.contractForm.controls.CONTRACT_EXTENSION['controls'].extension_status.setValue(
      this.refDataService.refData['CONTRACT_STATUS'].find((type) =>
        type.viewValue === row.extension_status).value);
  }

  /**************************************************************************
   * @description Check if URL contains the ID og
   *************************************************************************/
  canUpdate(_id: any): boolean {
    return _id && _id !== '';
  }

  /**************************************************************************
   * @description Open Dialog Panel
   *************************************************************************/
  openUploadSheet() {
    this.sheetService.displaySheet('uploadSheetComponent', null)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          this.selectedFile.name = res.name;
          this.selectedFile.file = res.file;
        }
      );
  }

  /**************************************************************************
   * @description Upload Image to Server  with async to promise
   *************************************************************************/
  async uploadFile(formData) {
    return this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }

  /**************************************************************************
   * @description : GET IMAGE FROM BACK AS BLOB
   *  create Object from blob and convert to url
   *************************************************************************/
  getFileName(id) {
      this.uploadService.getFilesByName(id).subscribe(
        (data) => {
          this.contractForm.patchValue( {
            INFORMATION: {
              attachments: data[0].caption
                        }
            }
          );
        }, error => {
          console.log(error);
        });
  }

  getFile(obj) {
    this.selectedFile.file = obj.data;
    this.selectedFile.name = obj.name;
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
