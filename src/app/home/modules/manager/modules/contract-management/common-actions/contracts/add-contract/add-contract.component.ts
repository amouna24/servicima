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
   * @description Static Customers And Status Declaration
   *************************************************************************/
  contractorsList: IContractor[] = [];

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
  collaboratorsList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([
    { value: 'test', viewValue: 'test'}
  ]);
  paymentTermsList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);

  /**************************************************************************
   * @description Declaring Form Group
   *************************************************************************/
  contractForm: FormGroup;

  /**************************************************************************
   * @description Declare the new ContractId to be used on update
   *************************************************************************/
  contractId: string;

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserInfo;
  contractInfo: IContract;
  contractExtensionInfo: IContractExtension;
  companyEmail: string;

  /**************************************************************************
   * @description Dynamic Component
   *************************************************************************/
  backURL: string;
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
      ]
    },
    {
      title: 'Contract Extension',
      titleKey: 'CONTRACT_EXTENSION',
      child: []
    },
  ];
  dynamicForm: IDynamicForm[] = [
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Contractor code',
          placeholder: 'Contractor code',
          type: FieldsType.SELECT,
          selectFieldList: this.collaboratorsList,
          formControlName: 'contractor_code'
        },
        {
          label: 'Collaborator email',
          placeholder: 'Collaborator email',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'collaborator_email'
        },
      ],
    },
    {
      titleRef: 'INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Contract type',
          placeholder: 'Type',
          type: FieldsType.SELECT,
          selectFieldList: this.statusList,
          formControlName: 'contract_type'
        },
        {
          label: 'Contract date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.INPUT,
          inputType: InputType.DATE,
          formControlName: 'contract_date'
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
          type: FieldsType.INPUT,
          inputType: InputType.DATE,
          formControlName: 'contract_start_date'
        },
        {
          label: 'End date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.INPUT,
          inputType: InputType.DATE,
          formControlName: 'contract_start_date'
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
          label: 'Company email',
          placeholder: 'exp@email.com',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
          formControlName: 'signer_company_email',
        },
        {
          label: 'Contractor email',
          placeholder: 'exp@email.com',
          type: FieldsType.INPUT,
          inputType: InputType.EMAIL,
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
          type: FieldsType.INPUT,
          inputType: InputType.DATE,
          formControlName: 'signature_company_date',
        },
        {
          label: 'Contractor signature date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.INPUT,
          inputType: InputType.DATE,
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
      titleRef: 'CONTRACT_EXTENSION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Start date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.INPUT,
          inputType: InputType.DATE,
          formControlName: 'extension_start_date',
        },
        {
          label: 'End date',
          placeholder: 'dd/mm/yyyy',
          type: FieldsType.INPUT,
          inputType: InputType.DATE,
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
  ];

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
  selectedFile = { file: FormData, name: '' };

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
  ) {
    this.contractForm = new FormGroup({
    });
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.initContractForm(null, null);
    this.getInitialData();
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
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent },
      ]);
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
    /************ get currencies List and next the value to the subject ************/
    /********************************** CURRENCY **********************************/
    this.currencyList.next(this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC};
    }));

    /*---------------------------------------------------------------*/
    this.utilsService.getRefData(
      this.utilsService.getCompanyId('ALL', 'ALL'),
      this.utilsService.getApplicationID('ALL'),
      ['LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES']
    );
    this.statusList.next(this.utilsService.refData['CONTRACT_STATUS']);
    this.contractorService
      .getContractors(`?contractor_type=${this.type}`)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          this.contractorsList = res;
        },
        (error) => {
          console.log(error);
        },
      );
    this.subscriptions.push(this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        console.log(data.user[0]['company_email']);
        this.userInfo = data;
        this.companyEmail = data.user[0]['company_email'];
        this.getPaymentTerms();
      }
    }));
  }

  /* Init Contract Form*/
  initContractForm(contract: IContract, contractExtension: IContractExtension) {
    this.contractForm = this.formBuilder.group({
      INFORMATION: this.formBuilder.group({
        contractor_code: [contract === null ? '' : contract.contractor_code, Validators.required],
        collaborator_email: [contract === null ? '' : contract.collaborator_email, Validators.required],
        contract_type: [contract === null ? '' : contract.contract_type],
        contract_date: [contract === null ? '' : contract.contract_date, [Validators.required]],
        contract_start_date: [contract === null ? '' : contract.contract_start_date],
        contract_end_date: [contract === null ? '' : contract.contract_end_date],
        contract_status: [contract === null ? '' : contract.contract_status],
        attachments: [contract === null ? '' : this.getFile(contract.attachments)],
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
      CONTRACT_EXTENSION: this.formBuilder.group({
        extension_start_date: [contractExtension === null ? '' : contractExtension.extension_start_date],
        extension_end_date: [contractExtension === null ? '' : contractExtension.extension_end_date],
        extension_status: [contractExtension === null ? '' : contractExtension.extension_status],
        extension_rate: [contractExtension === null ? '' : contractExtension.extension_rate, Validators.required],
        extension_currency_cd: [contractExtension === null ? '' : contractExtension.extension_currency_cd],
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
          this.contractExtensionInfo = res[1][0];
          this.initContractForm(this.contractInfo, this.contractExtensionInfo);
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

  /**
   * @description Create New Contract
   */
  async createNewContract(data: FormGroup) {
    const Contract = this.contractForm.value;
    Contract.application_id = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.application_id : this.userInfo.company[0].companyKey.application_id;
    Contract.contract_code = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.contract_code : `${Math.random().toString(36).substring(7).toUpperCase()}`;
    Contract.email_address  = this.canUpdate(this.contractId) ?
      this.contractInfo.contractKey.email_address : this.userInfo.company[0].companyKey.email_address;
    Contract.extension_code = this.canUpdate(this.contractId) ?
      this.contractExtensionInfo.contractExtensionKey.extension_code : `${Math.random().toString(36).substring(7).toUpperCase()}`;
    Contract.contract_type = this.type;
    Contract.attachments = this.canUpdate(this.contractId) ?
      this.contractInfo.attachments : await this.uploadFile(this.selectedFile.file);
    console.log('new Contract', Contract);
    if (this.canUpdate(this.contractId)) {
      forkJoin(
        [
          this.contractsService.updateContract(Contract),
          this.contractsService.updateContractExtension(Contract),
        ]
      )
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
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
      forkJoin(
        [
          this.contractsService.addContract(Contract),
          this.contractsService.addContractExtension(Contract),
        ]
      )
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
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
  getFile(id): string {
    let caption;
    this.uploadService.getFilesByName(id).subscribe(
      (data) => {
        console.log('data', data[0]);
        caption = data[0].caption;
        console.log('caption', caption);
      }, error => {
        console.log(error);
      });
    return caption;
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
