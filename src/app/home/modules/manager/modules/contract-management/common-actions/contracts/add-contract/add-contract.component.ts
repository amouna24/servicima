import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject, Subscription } from 'rxjs';
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
  currenciesList: IViewParam[] = [];
  statusList: IViewParam[] = [];
  contractorsList: IContractor[] = [];
  paymentTermsList: ICompanyPaymentTermsModel[] = [];
  collaboratorsList = [
    { value: 'test', viewValue: 'test'}
  ];

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
    this.utilsService.addIcon(
      [
        { name: 'general', path: '../assets/icons/general.svg'},
        { name: 'credit-card', path: '../assets/icons/credit-card.svg'},
        { name: 'contact', path: '../assets/icons/contact.svg'},
      ]
    );
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
    this.mapData();
    /************ get currencies List and next the value to the subject ************/
    this.filteredCurrencies.next(this.currenciesList.slice());
    this.utilsService.changeValueField(this.currenciesList, this.contractForm.controls.filterCurrencyControl, this.filteredCurrencies);

    /*---------------------------------------------------------------*/
    this.utilsService.getRefData(
      this.utilsService.getCompanyId('ALL', 'ALL'),
      this.utilsService.getApplicationID('ALL'),
      ['LEGAL_FORM', 'VAT', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES']
    );
    this.statusList = this.utilsService.refData['CONTRACT_STATUS'];
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

  /**
   * @description: : mapping data
   */
  mapData(): void {
    this.appInitializerService.currenciesList.forEach((currency) => {
      this.currenciesList.push({ value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC});
    });
  }

  /* Init Contract Form*/
  initContractForm(contract: IContract, contractExtension: IContractExtension) {
    this.contractForm = this.formBuilder.group({
      contractor_code: [contract === null ? '' : contract.contractor_code, Validators.required],
      collaborator_email: [contract === null ? '' : contract.collaborator_email, Validators.required],
      contract_type: [contract === null ? '' : contract.contract_type],
      contract_start_date: [contract === null ? '' : contract.contract_start_date],
      contract_end_date: [contract === null ? '' : contract.contract_end_date],
      contract_date: [contract === null ? '' : contract.contract_date, [Validators.required]],
      contract_status: [contract === null ? '' : contract.contract_status],
      signer_company_email: [contract === null ? '' : contract.signer_company_email],
      signer_contractor_email: [contract === null ? '' : contract.signer_contractor_email],
      signature_company_date: [contract === null ? '' : contract.signature_company_date],
      signature_contractor_date: [contract === null ? '' : contract.signature_contractor_date],
      contract_rate: [contract === null ? '' : contract.contract_rate, Validators.required],
      currency_cd: [contract === null ? '' : contract.currency_cd],
      payment_terms: [contract === null ? '' : contract.payment_terms],
      attachments: [contract === null ? '' : this.getFile(contract.attachments)],
      /* Contract Extension */
      extension_start_date: [contractExtension === null ? '' : contractExtension.extension_start_date],
      extension_end_date: [contractExtension === null ? '' : contractExtension.extension_end_date],
      extension_status: [contractExtension === null ? '' : contractExtension.extension_status],
      extension_rate: [contractExtension === null ? '' : contractExtension.extension_rate, Validators.required],
      extension_currency_cd: [contractExtension === null ? '' : contractExtension.extension_currency_cd],
      /* Filter Form Control */
      filterCurrencyControl: [''],
      paymentTermsControl: [''],

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
          this.paymentTermsList = companyPaymentTerms;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * @description Create New Contract
   */
  async createNewContract() {
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
