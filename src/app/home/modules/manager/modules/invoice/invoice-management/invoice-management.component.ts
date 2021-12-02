import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '@environment/environment';

import { TranslateService } from '@ngx-translate/core';
import { UploadService } from '@core/services/upload/upload.service';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';
import { UserService } from '@core/services/user/user.service';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { CompanyBankingInfoService } from '@core/services/company-banking-info/company-banking-info.service';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { ContractProjectService } from '@core/services/contract-project/contract-project.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { SheetService } from '@core/services/sheet/sheet.service';

import { IContractProject } from '@shared/models/contractProject.model';
import { IContractor } from '@shared/models/contractor.model';
import { IContract } from '@shared/models/contract.model';
import { ICompanyBankingInfoModel } from '@shared/models/companyBankingInfo.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { IInvoiceHeaderModel } from '@shared/models/invoiceHeader.model';
import { IViewParam } from '@shared/models/view.model';
import { IInvoiceLineModel } from '@shared/models/invoiceLine.model';
import { IUserModel } from '@shared/models/user.model';
import { IInvoicePaymentModel } from '@shared/models/invoicePayment.model';
import { IInvoiceAttachmentModel } from '@shared/models/invoiceAttachment.model';

import { PaymentInvoiceComponent } from '../payment-invoice/payment-invoice.component';

@Component({
  selector: 'wid-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent implements OnInit, OnDestroy {

  /**************************************************************************
   *  Initialise form
   *************************************************************************/
  form: FormGroup;
  formFactor: FormGroup;
  formHeader: FormGroup;
  formCompanyBanking: FormGroup;
  /**************************************************************************
   *  Initialise general information
   *************************************************************************/
  applicationId: string;
  companyEmail: string;
  emailAddress: string;
  companyId: string;
  companyBankingInfos: ICompanyBankingInfoModel;
  userInfo: IUserInfo;
  listUsers: IUserModel[];
  avatar: SafeUrl;
  paymentTerms: number;
  /**************************************************************************
   *  Initialise contractor, contract and project
   *************************************************************************/
  contract: IContract;
  contractCode: string;
  contractor: IContractor;
  editContractors = false;
  contractorSelected = false;
  listContractor: IContractor[];
  listContract: IContract[];
  listProject: IContractProject[];
  currencyCode: string;

  /**************************************************************************
   *  Initialise invoice
   *************************************************************************/
  invoiceNbr: number;
  statusInvoice: string;
  invoices: object;
  invoiceLine: IInvoiceLineModel;
  invoiceLineCopy: object;
  invoiceHeader: IInvoiceHeaderModel;
  invoicePayment: IInvoicePaymentModel[] = [];
  invoiceAttachment: IInvoiceAttachmentModel[] = [];
  maxInvoiceHeader: number;
  factorInvoice = false;
  updateOrAddInvoice: string;

  /**************************************************************************
   *  Payment invoice
   *************************************************************************/
  sousTotalHT = 0;
  vatMount = 0;
  totalTTC = 0;
  totalPayments = 0;
  leftToPay: number;
  showPayment = false;
  vat: number;

  showAttachmentFile = false;
  iconVisible: boolean;
  paymentMethodsList: IViewParam[];

  listToRemovePayment: string[] = [];
  listToRemoveAttachment: string[] = [];
  listToRemoveAttachmentFromUpload: string[] = [];

  tableColumnsInvoicePayment: string[] = ['Entered By', 'Type', 'Notes', 'Date', 'Amount', 'Action'];
  tableColumnsInvoiceAttachment: string[] = ['File Title', 'Size', 'Date', 'Action'];
  dataSourceInvoicePayment: MatTableDataSource<IInvoicePaymentModel> = new MatTableDataSource([]);
  dataSourceInvoiceAttachment: MatTableDataSource<IInvoiceAttachmentModel> = new MatTableDataSource([]);
  /**************************************************************************
   *  Initialise isLoading and isLoad
   *************************************************************************/
  isLoading = new BehaviorSubject<boolean>(true);
  isLoad = new BehaviorSubject<boolean>(false);
  /**************************************************************************
   *  Initialise destroyed
   *************************************************************************/
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  @ViewChild('tableInvoicePayment', { read: MatSort, static: false }) sortInvoicePayment: MatSort;
  @ViewChild('tableInvoiceAttachment', { read: MatSort, static: false }) sortInvoiceAttachment: MatSort;
  @ViewChild('buttonAddLine') buttonAddLine: ElementRef;
  constructor(private invoiceService: InvoiceService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private modalService: ModalService,
    private refDataService: RefdataService,
    private companyBankingInfo: CompanyBankingInfoService,
    private contractsService: ContractsService,
    private contractProjectService: ContractProjectService,
    private uploadService: UploadService,
    private router: Router,
    private location: Location,
    private sheetService: SheetService,
    private translate: TranslateService,
    private paymentTermsService: CompanyPaymentTermsService,
    private contractorsService: ContractorsService,
    private localStorageService: LocalStorageService) {
    this.invoiceNbr = this.router.getCurrentNavigation()?.extras?.state?.nbrInvoice;
  }

  /**************************************************************************
   *  @description Loaded when component in init state
   *************************************************************************/
  async ngOnInit(): Promise<void> {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.emailAddress = this.localStorageService.getItem('userCredentials').email_address;
    this.initForm();
    await this.getConnectedUser();
    await this.getRefData();
    await this.getUsers();
    await this.getContractor();
    await this.getInvoiceNbr();
    this.getCompanyBankingInfo();

    this.modalService.registerModals(
      { modalName: 'PayInvoice', modalComponent: PaymentInvoiceComponent });
    this.sheetService.registerSheets(
      [
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent },
      ]);
  }

  /**************************************************************************
   * @description Upload Image to Server
   * @param formData: formData
   *************************************************************************/
  async uploadFile(formData: FormData): Promise<string> {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }

  /**************************************************************************
   *  @description : initialization of the form
   *************************************************************************/
  initForm(): void {
    this.formHeader = this.formBuilder.group({
      contractor: ['', [Validators.required]],
      contract: ['', [Validators.required]],
      invoiceNbr: ['', [Validators.required]],
      invoiceDelay: ['', [Validators.required]],
      invoiceDate: ['', [Validators.required]],
    });

    this.form = this.formBuilder.group({
      invoice_line_total_amount: [''],
      input: this.formBuilder.array(
        [Validators.required])
    });

    this.formFactor = this.formBuilder.group({
      factorInvoice: ['', [Validators.required]],
    });

    this.formCompanyBanking = this.formBuilder.group({
      comment1: ['', [Validators.required]],
    });

  }

  /**************************************************************************
   *  @description select and upload attachment
   *************************************************************************/
  async viewData(): Promise<void> {
    this.sheetService.displaySheet('uploadSheetComponent', null)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        async (res) => {
          if (!!res) {
            const file = res.selectedFile;
            const formData = new FormData();
            const file1 = new File([file], file['name'], {
              lastModified: new Date().getTime(),
              type: file.type
            });
            formData.append('file', file1);
            formData.append('caption', file1.name);
            const invoiceAttachment = {
              application_id: this.applicationId,
              company_email: this.companyEmail,
              invoice_nbr: this.invoiceNbr,
              code_attachment: 'CODE-ATTACHMENT' + file.name,
              file_title: file.name,
              size: this.formatBytes(file.size),
              date: new Date(),
              attachment: '',
              formData
            };
            this.invoiceAttachment.push(invoiceAttachment as any);
            this.dataSourceInvoiceAttachment = new MatTableDataSource(this.invoiceAttachment);
          }
        }, (error => {
          console.error(error);
        }));
  }

  /**************************************************************************
   * Format the size to a human readable string
   * @param bytes: number
   * @returns the formatted string e.g. `105 kB` or 25.6 MB
   *************************************************************************/
  formatBytes(bytes: number): string {
    const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const factor = 1024;
    let index = 0;

    while (bytes >= factor) {
      bytes /= factor;
      index++;
    }
    return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  }

  /**************************************************************************
   *  @description Get all users
   *  return All users
   *************************************************************************/
  async getUsers(): Promise<IUserModel[]> {
    return new Promise((resolve) => {
      this.userService.getAllUsers(`?company_email=${this.companyEmail}`)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data) => {
          this.listUsers = data['results'];
          resolve(this.listUsers);
        }, (error => {
          console.error(error);
        }));
    });
  }

  /**
   * @description : show attachment
   * @param row: invoice attachment
   */
  showAttachment(row: IInvoiceAttachmentModel): void {
    const path = environment.uploadFileApiUrl + '/show/' + row['attachment'];
    window.open(path);
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefData(): Promise<void> {
    const list = ['PAYMENT_MODE'];
    const refData = await this.refDataService.getRefData(this.companyId, this.applicationId,
      list);
    this.paymentMethodsList = refData['PAYMENT_MODE'];
  }

  /**
   * @description : refresh invoice payment
   */
  refreshPayment(): void {
    this.dataSourceInvoicePayment = new MatTableDataSource<IInvoicePaymentModel>(this.invoicePayment);
    this.dataSourceInvoicePayment.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Entered By': {
          return item['Entred'].toLowerCase();
        }
        case 'Type': {
          return item.payment_mode_desc.toLowerCase();
        }
        case 'Notes': {
          return item.note.toLowerCase();
        }
        case 'Date': {
          return item.InvoicePaymentKey.payment_date;
        }
        case 'Amount': {
          return item.invoice_line_unit_amount;
        }
        default: {
          return item[property];
        }
      }
    };
    this.dataSourceInvoicePayment.sort = this.sortInvoicePayment;
  }

  /**
   * @description : refresh invoice payment
   */
  refreshInvoiceAttachment(): void {
    this.dataSourceInvoiceAttachment = new MatTableDataSource<IInvoiceAttachmentModel>(this.invoiceAttachment);
    this.dataSourceInvoiceAttachment.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'File Title': {
          return item.file_title.toLowerCase();
        }
        case 'Size': {
          return item.size.toLowerCase();
        }
        case 'Date': {
          return item.date;
        }
        default: {
          return item[property];
        }
      }
    };
    this.dataSourceInvoiceAttachment.sort = this.sortInvoiceAttachment;
  }

  /**
   * @description : Enter payment
   */
  enterPayment(): void {
    this.refreshPayment();
    this.showAttachmentFile = false;
    this.showPayment = !this.showPayment;
  }

  /**
   * @description : delete attachment
   */
  deleteAttachment(row: IInvoiceAttachmentModel, attachment: string): void {
    this.listToRemoveAttachmentFromUpload.push(attachment);
    if (attachment) {
      this.invoiceAttachment = this.invoiceAttachment.filter((data) => {
        if (data.InvoiceAttachmentKey?.code_attachment !== row.InvoiceAttachmentKey?.code_attachment) {
          return data;
        }
      });
    } else {
      this.invoiceAttachment = this.invoiceAttachment.filter((data) => {
        if (data['code_attachment'] !== row['code_attachment']) {
          return data;
        }
      });
    }
    this.dataSourceInvoiceAttachment = new MatTableDataSource<IInvoiceAttachmentModel>(this.invoiceAttachment);
  }

  /**
   * @description : show attachment
   */
  showAttach(): void {
    this.refreshInvoiceAttachment();
    this.showPayment = false;
    this.showAttachmentFile = !this.showAttachmentFile;
  }

  /**
   * @description : count  payment
   */
  countPayment(): void {
    this.leftToPay = this.totalTTC;
    this.totalPayments = 0;
    this.invoicePayment.map((data) => {
      this.totalPayments = this.totalPayments + parseInt(data['invoice_line_unit_amount'], 10);
    });
    this.countLeftToPay();
  }

  /**************************************************************************
   *  @description : count left to pay
   *************************************************************************/
  countLeftToPay(): void {
    this.leftToPay = this.totalTTC - this.totalPayments;
  }

  /**************************************************************************
   *  @description : set company banking info
   *************************************************************************/
  setCompanyBankingInfo(): void {
    if (this.formFactor.value.factorInvoice) {
      this.formCompanyBanking.controls['comment1'].setValue(`Bank domiciliation: ${this.companyBankingInfos?.bank_domiciliation}
Name: ${this.companyBankingInfos?.bank_name}
Adresse: ${this.companyBankingInfos?.bank_address}
BIC CODE: ${this.companyBankingInfos?.bic_code}
BAN: ${this.companyBankingInfos?.iban}
RIB:${this.companyBankingInfos?.rib}`);
    } else {
      this.formCompanyBanking.controls['comment1'].setValue(`${this.companyBankingInfos?.factor_informations}`);
    }
  }

  /**************************************************************************
   *  @description : show info contractor
   *************************************************************************/
  showInfoContractor(): void {
    this.router.navigate(
      ['/manager/contract-management/suppliers-contracts/suppliers'],
      {
        queryParams: {
          id: btoa(this.contractor['_id']),
          cc: btoa(this.contractor.contractorKey.contractor_code),
          ea: btoa(this.contractor['contractorKey']['email_address'])
        }
      });
  }

  /**************************************************************************
   *  @description : set the value of the form if it was an update invoice
   *************************************************************************/
  async setForm(): Promise<void> {
    this.invoiceHeader = this.invoices[0]['results'][0];
    this.invoiceLine = this.invoices[2] as IInvoiceLineModel;
    this.contractCode = this.invoiceHeader['contract_code'];
    this.currencyCode = this.invoiceHeader['invoice_currency'];
    this.statusInvoice = this.invoiceHeader['invoice_status'];
    this.editContractors = false;
    await this.getContract(this.invoiceHeader['contractor_code']);
    this.getContractProject(this.invoiceHeader['contract_code']);
    this.countPayment();
    this.formFactor.controls['factorInvoice'].setValue(this.invoiceHeader['factor_involved'] === 'Y');
    this.invoiceLineCopy = { ...this.invoiceLine };
    this.maxInvoiceHeader = this.invoices[2]?.max ? parseInt(this.invoices[2]['max'], 10) + 1 : 1;
    this.formHeader = this.formBuilder.group({
      contractor: this.invoiceHeader['contractor_code'],
      contract: this.invoiceHeader['contract_code'],
      invoiceNbr: this.invoiceNbr,
      invoiceDate: this.invoiceHeader['invoice_date'],
      invoiceDelay: this.invoiceHeader['invoice_delay'],
    });

    this.form = this.formBuilder.group({
      input: this.formBuilder.array(this.invoiceLine ? Object.values(this.invoiceLine).map(data => this.formBuilder.group({
        project_code: [data.project_code ? data.project_code : null],
        project_desc: [data.project_desc ? data.project_desc : null],
        days_nbr: [data.days_nbr ? data.days_nbr : null],
        vat_rate: [data.vat_rate ? data.vat_rate : null],
        invoice_line_unit_amount: [data.invoice_line_unit_amount ? data.invoice_line_unit_amount : null],
        invoice_line_total_amount: [data.invoice_line_total_amount ? data.invoice_line_total_amount : null],
        vat_amount: [data.vat_amount ? data.vat_amount : null],
        invoice_line_code: [data.InvoiceLineKey.invoice_line_code ? data.InvoiceLineKey.invoice_line_code : null],
        discount: [data.discount ? data.discount : null],
      })) : []),
    });
    this.sousTotalHT = this.getSum('invoice_line_total_amount');
    this.vatMount = this.getSum('vat_amount');
    this.totalTTC = this.getSum('vat_amount') + this.getSum('invoice_line_total_amount');
    this.countLeftToPay();
    await this.getContract(this.invoiceHeader['contractor_code']);
    this.contract = this.listContract.find(value => value.contractKey.contract_code === this.contractCode);

  }

  /**************************************************************************
   *  @description : edit contractor
   *************************************************************************/
  editContractor(): void {
    this.editContractors = true;
  }

  /**************************************************************************
   * @description Get connected user
   *************************************************************************/
  async getConnectedUser(): Promise<string> {
    return new Promise((resolve) => {
      this.userService.connectedUser$
        .pipe(takeUntil(this.destroyed$))
        .subscribe(
          async (userInfo) => {
            if (userInfo) {
              this.companyId = userInfo['company'][0]['_id'];
              this.userInfo = userInfo['company'][0];
              this.avatar = await this.uploadService.getImage(this.userInfo['photo']);
              this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
              resolve(this.companyEmail);
            }
          }, (error => {
            console.error(error);
          }));
    });
  }

  /**************************************************************************
   *  @description : get invoice number
   *************************************************************************/
  async getInvoiceNbr(): Promise<void> {

    if (this.invoiceNbr) {
      this.updateOrAddInvoice = 'update';
      await this.getInvoice();
      this.invoicePayment = this.invoices[1] as IInvoicePaymentModel[];
      this.refreshPayment();
      await this.getAttachmentInvoice();
      this.refreshInvoiceAttachment();
      await this.setForm();
      this.formHeader.get('invoiceNbr').disable();
      this.formHeader.patchValue({ invoiceNbr: this.invoiceNbr });
      this.isLoading.next(false);
    } else {
      this.isLoading.next(false);
      this.updateOrAddInvoice = 'add';
      const maxInvoiceNbr = await this.getMaxHeaderInvoiceNbr() as string;
      this.invoiceNbr = maxInvoiceNbr ? parseInt(maxInvoiceNbr, 10) + 1 : 1;
      this.formHeader.controls['invoiceNbr'].setValue(this.invoiceNbr);
      this.formHeader.controls['invoiceDate'].setValue(this.datePipe.transform(new Date()));
    }
  }

  /**************************************************************************
   *  @description : get attachment invoice
   *************************************************************************/
  getAttachmentInvoice(): Promise<IInvoiceAttachmentModel[]> {
    return new Promise((resolve) => {
      this.invoiceService.getInvoiceAttachment(`?company_email=${this.companyEmail}&invoice_nbr=` + this.invoiceNbr)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data) => {
          this.invoiceAttachment = data;
          this.invoiceAttachment.map((res) => {
            this.listToRemoveAttachment.push(res['_id']);

          }, (error => {
            console.error(error);
          }));
          resolve(this.invoiceAttachment);
        });
    });
  }

  /**************************************************************************
   *  @description : get contractor
   *************************************************************************/
  getContractor(): Promise<IContractor[]> {
    return new Promise((resolve) => {
      this.contractorsService.getContractors(`?email_address=${this.companyEmail}`)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((contractor) => {
          this.listContractor = contractor['results'];
          resolve(this.listContractor);
        }, (error => {
          console.error(error);
          resolve(error);
        }));
    });
  }

  /**************************************************************************
   *  @description : get contract
   *  @param contractorCode: contract code
   *************************************************************************/
  getContract(contractorCode: string): Promise<IContract[]> {
    return new Promise((resolve) => {
      this.contractorSelected = true;
      this.contractor = this.listContractor.find(value => value.contractorKey.contractor_code === contractorCode);
      this.vat = parseInt(this.listContractor.find(value => value.contractorKey.contractor_code === contractorCode).vat_nbr, 10);
      this.contractsService.getContracts(`?email_address=${this.companyEmail}&contractor_code=${contractorCode}`)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((contract) => {
          if (contract['results']) {
            this.listContract = contract['results'];
            resolve(this.listContract);
          }
        }, (error => {
          console.error(error);
          resolve(error);
        }));
    });

  }

  /**************************************************************************
   *  @description : get vat or mount invoice
   *  @param i : index of line
   *************************************************************************/
  getTvaOrMountInvoice(i: number): void {
    if (this.form.value.input[i]['days_nbr'] && this.form.value.input[i]['invoice_line_unit_amount']) {
      const preTotal = this.form.value.input[i]['days_nbr'] * this.form.value.input[i]['invoice_line_unit_amount'];
      const total = this.form.value.input[i]['discount'] ?
        (preTotal - ((preTotal * this.form.value.input[i]['discount']) / 100)) :
        preTotal;
      const vat = (total * this.vat) / 100;
      const formArr = this.form.controls['input'] as FormArray;
      formArr.controls[i].patchValue({ invoice_line_total_amount: isNaN(total) ? 'error' : total });
      formArr.controls[i].patchValue({ vat_amount: isNaN(vat) ? 'error' : vat });
      this.sousTotalHT = this.getSum('invoice_line_total_amount');
      this.vatMount = this.getSum('vat_amount');
      this.totalTTC = this.getSum('vat_amount') + this.getSum('invoice_line_total_amount');
      this.countLeftToPay();
    }
  }

  /**************************************************************************
   *  @description : get details contract
   *************************************************************************/
  getDetailsContract(contractCode: string): void {
    this.editContractors = false;
    this.contract = this.listContract.find(value => value.contractKey.contract_code === contractCode);
    this.contractCode = contractCode;
    this.currencyCode = this.contract['currency_cd'];
    this.paymentTermsService.getCompanyPaymentTerms(`${this.companyEmail}`, 'ACTIVE')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.paymentTerms = data.find(value => value.companyPaymentTermsKey.payment_terms_code === this.contract['payment_terms']).delay;
        this.formHeader.controls['invoiceDelay'].
          setValue(this.paymentTerms ? this.datePipe.transform(new Date().setDate(new Date().getDate() + this.paymentTerms)) : null);
      }, (error => {
        console.error(error);
      }));
    this.getContractProject(this.contractCode);
    const frmArray = this.form.get('input') as FormArray;
    frmArray.clear();
    this.sousTotalHT = 0;
    this.totalTTC = 0;
    this.vatMount = 0;
  }

  /**************************************************************************
   *  @description mouse Enter
   *************************************************************************/
  mouseEnter(): void {
    this.iconVisible = true;
  }

  /**************************************************************************
   *  @description mouse leave
   *************************************************************************/
  mouseLeave(): void {
    this.iconVisible = false;
  }

  /**************************************************************************
   *  @description Get Contract Project
   *  @param contractCode: string
   *************************************************************************/
  getContractProject(contractCode: string): void {
    this.contractProjectService.getContractProject(`${this.companyEmail}`, contractCode)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.listProject = data.results;
      }, (error => {
        console.error(error);
      }));
  }

  /**************************************************************************
   *  @description Get Company Banking Info
   *************************************************************************/
  getCompanyBankingInfo(): void {
    this.companyBankingInfo.getCompanyBankingInfo(this.userInfo['companyKey'].email_address)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.companyBankingInfos = data[0];
        if (this.invoiceHeader?.comment1) {
          this.formCompanyBanking.controls['comment1'].setValue(this.invoiceHeader?.comment1);
        } else {
          if (!this.formFactor.value.factorInvoice) {
            const bankingInfo = `Bank domiciliation: ${this.companyBankingInfos?.bank_domiciliation}
Name: ${this.companyBankingInfos?.bank_name.trim()}
Adresse: ${this.companyBankingInfos?.bank_address.trim()}
BIC CODE: ${this.companyBankingInfos?.bic_code.trim()}
BAN: ${this.companyBankingInfos?.iban}
RIB:${this.companyBankingInfos?.rib}`;
            this.formCompanyBanking.controls['comment1'].setValue(bankingInfo);
          } else {
            this.formCompanyBanking.controls['comment1'].setValue(`${this.companyBankingInfos?.factor_informations}`);
          }
        }
      }, (error => {
        console.error(error);
      }));

  }

  /**************************************************************************
   *  @description Get sum
   *  @param code: string
   *************************************************************************/
  getSum(code: string): number {
    let sum = 0;
    Object.values(this.form.value.input).map((data) => {
      return sum = data[code] + sum;
    });
    return sum;
  }

  /**************************************************************************
   *  @description to pay
   *************************************************************************/
  toPay(): void {
    this.showAttachmentFile = false;
    const data = {
      application_id: this.applicationId,
      company_email: this.companyEmail,
      invoice_nbr: this.invoiceNbr
    };
    this.modalService.displayModal('PayInvoice', data,
      '500px', '580px')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async (res) => {
        if (res) {
          const listLine = {
            ...res,
            InvoicePaymentKey: {
              company_email: this.companyEmail,
              invoice_nbr: this.invoiceNbr,
              application_id: this.applicationId,
              payment_date: res['payment_date'],
            }
          };
          this.invoicePayment.push(listLine);
          this.mapInvoicePayment(this.invoicePayment);
          this.refreshPayment();
          this.countPayment();
        }
      }, (error => {
        console.error(error);
      }));

  }

  /**************************************************************************
   *  @description Get Invoice
   *************************************************************************/
  async getInvoice(): Promise<void> {
    const promise1 = new Promise((resolve) => {
      this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmail}&invoice_nbr=` + this.invoiceNbr)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((invoiceHeader) => {
          resolve(invoiceHeader);
        }, () => {
          resolve([]);
        });
    });

    const promise2 = new Promise((resolve) => {
      this.invoiceService.getInvoicePayment(`?company_email=${this.companyEmail}&invoice_nbr=` + this.invoiceNbr)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((invoicePayment) => {
          this.mapInvoicePayment(invoicePayment);
          if (invoicePayment.length > 0) {
            invoicePayment.map((data) => {
              this.listToRemovePayment.push(data['_id']);
            }, (error => {
              console.error(error);
            }));
          }
          resolve(invoicePayment);
        }, () => {
          resolve([]);
        });
    });

    const promise3 = new Promise((resolve) => {
      this.invoiceService.getInvoiceLine(`?company_email=${this.companyEmail}&invoice_nbr=${this.invoiceNbr}`)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((invoiceLine) => {
          resolve(invoiceLine);
        }, () => {
          resolve([]);
        });
    });

    return Promise.all([promise1, promise2, promise3]).then((values) => {
      this.invoices = values;
    });

  }

  /**************************************************************************
   *  @description map invoice payment
   *  @param invoicePayment: invoice payment
   *************************************************************************/
  mapInvoicePayment(invoicePayment: IInvoicePaymentModel[]): void {
    invoicePayment.map((invoicePay) => {
      const firstName = this.listUsers.find(value => value.userKey.email_address === invoicePay['entered_by']).first_name;
      const lastName = this.listUsers.find(value => value.userKey.email_address === invoicePay['entered_by']).last_name;
      invoicePay['Entred'] = firstName + '   ' + lastName;
      invoicePay['payment_mode_desc'] = this.paymentMethodsList.find(value => value.value
        === invoicePay['payment_mode']).viewValue;
    });
  }

  /**************************************************************************
   *  @description get Max Header Invoice Nbr
   *************************************************************************/
  async getMaxHeaderInvoiceNbr(): Promise<number | string> {
    return new Promise((resolve) => {
      this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmail}`)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((invoiceHeader) => {
          this.maxInvoiceHeader = invoiceHeader['max'];
          resolve(this.maxInvoiceHeader);
        }, () => {
          resolve(null);
        });
    });
  }

  /**************************************************************************
   *  @description add Invoice Line
   *  @param type: type
   *  @param valueAttachment: value attachment
   *************************************************************************/
  addInvoiceHeader(type: string, valueAttachment?: string): void {
    const invoiceHeader = {
      application_id: this.applicationId,
      company_email: this.companyEmail,
      invoice_nbr: this.updateOrAddInvoice === 'update' ? this.invoiceNbr : parseInt(this.formHeader.value.invoiceNbr, 10),
      invoice_status: type,
      factor_involved: this.formFactor.value.factorInvoice ? 'Y' : 'N',
      invoice_date: this.formHeader.value.invoiceDate,
      invoice_delay: this.formHeader.value.invoiceDelay,
      contractor_code: this.contractor.contractorKey.contractor_code,
      contract_code: this.contractCode,
      vat_amount: this.vatMount,
      invoice_total_amount: this.totalTTC,
      invoice_currency: this.currencyCode,
      invoice_amount: this.sousTotalHT,
      comment1: this.formCompanyBanking.value.comment1,
      comment2: '',
      attachment: valueAttachment ? valueAttachment : '',
      password: '12345',
      old_password: '12345'
    };
    if (!this.invoiceHeader) {
      this.invoiceService.addInvoiceHeader(invoiceHeader)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data) => {
          this.invoiceHeader = data[0];
        }, (error => {
          console.error(error);
        }));
    } else {
      this.invoiceService.updateInvoiceHeader(invoiceHeader)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data) => {
          this.invoiceHeader = data[0];
        }, (error => {
          console.error(error);
        }));
    }
  }

  /**************************************************************************
   * @description : Delete line invoice
   * @param i: index of line
   *************************************************************************/
  delete(i: number): void {
    this.getListRole().removeAt(i);
  }

  /**************************************************************************
   * @description : get Project
   * @param index: index of line
   * @param project: project of line
   *************************************************************************/
  getProject(index: number, project: IContractProject): void {
    const formArr = this.form.controls['input'] as FormArray;
    formArr.controls[index].patchValue({ project_desc: project.project_desc });
  }

  /**************************************************************************
   * @description  get list array input
   *************************************************************************/
  getListRole(): FormArray {
    return this.form.get('input') as FormArray;
  }

  /**************************************************************************
   * @description  add new line invoice
   *************************************************************************/
  onAddAnotherLine(): void {
    return this.getListRole().push(this.formBuilder.group({
      project_code: '',
      project_desc: '',
      days_nbr: '',
      vat_rate: this.vat,
      vat_amount: '',
      invoice_line_total_amount: '',
      invoice_line_unit_amount: '',
      discount: '',
    }));

  }

  /**************************************************************************
   * @description Get list invoice line
   *************************************************************************/
  getListInvoiceLine(): object[] {
    return this.form.value.input.map((res) => {
      return {
        ...res,
        InvoiceLineKey: {
          company_email: this.companyEmail,
          invoice_nbr: this.updateOrAddInvoice === 'update' ? this.invoiceNbr : parseInt(this.formHeader.value.invoiceNbr, 10),
          application_id: this.applicationId,
          invoice_line_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-ILC`,
        }
      };
    });
  }

  /**************************************************************************
   * @description Delete payment
   * @param row: row of payment invoice
   *************************************************************************/
  deletePayment(row: IInvoicePaymentModel): void {
    row.disabled = true;
    const listLine = {
      InvoicePaymentKey: {
        application_id: row.InvoicePaymentKey.application_id,
        company_email: row.InvoicePaymentKey.company_email,
        invoice_nbr: row.InvoicePaymentKey.invoice_nbr,
        payment_date: new Date(),
      },
      bank_account: row.bank_account,
      entered_by: this.emailAddress,
      invoice_line_unit_amount: - row.invoice_line_unit_amount,
      note: row.note,
      payment_mode: row.payment_mode,
      payment_mode_desc: row.payment_mode_desc,
      disabled: true
    };
    this.invoicePayment.push(listLine as any);
    this.mapInvoicePayment(this.invoicePayment);
    this.refreshPayment();
    this.countPayment();
  }

  /**************************************************************************
   * @description add or update list payment
   *************************************************************************/
  addOrUpdatePayment(): void {
    if (this.invoicePayment.length > 0) {
      this.invoiceService.deleteManyInvoicePayment(this.listToRemovePayment)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => {
          if (res) {
            this.invoiceService.addManyInvoicePayment(this.invoicePayment)
              .pipe(takeUntil(this.destroyed$))
              .subscribe(() => {
              }, (error => {
                console.error(error);
              }));
          }
        }, (error => {
          console.error(error);
        }));
    } else {
      this.invoiceService.addManyInvoicePayment(this.invoicePayment)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
        }, (error => {
          console.error(error);
        }));
    }
  }

  /**************************************************************************
   * @description add or update line invoice
   *************************************************************************/
  addOrUpdateInvoiceLine(): void {
    let listToRemove = [];
    let listLine = [];
    if (this.invoiceLineCopy === { } || !this.invoiceLineCopy) {
      listLine = this.getListInvoiceLine();
      this.invoiceService.addManyInvoiceLine(listLine)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
        }, (error => {
          console.error(error);
        }));
    } else {
      listLine = this.getListInvoiceLine();

      listToRemove = Object.values(this.invoiceLineCopy).map((res) => {
        return res['_id'];
      });

      this.invoiceService.deleteManyInvoiceLine(listToRemove)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.invoiceService.addManyInvoiceLine(listLine)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
              this.invoiceService.getInvoiceLine(`?company_email=${this.companyEmail}&invoice_nbr=${this.formHeader.value.invoiceNbr}`)
                .pipe(takeUntil(this.destroyed$))
                .subscribe((invoice) => {
                  if (invoice) {
                    this.invoiceLineCopy = invoice;
                  }
                }, (error => {
                  console.error(error);
                }));
            }, (error => {
              console.error(error);
            }));
        }, (error => {
          console.error(error);
        }));
    }
  }

  /**************************************************************************
   * @description add or update list attachment
   *************************************************************************/
  async addOrUpdateAttachment(): Promise<void> {
    const listAttachment = this.invoiceAttachment.map((res) => {
      return {
        ...res,
        InvoiceAttachmentKey: {
          company_email: this.companyEmail,
          invoice_nbr: this.invoiceNbr,
          application_id: this.applicationId,
          code_attachment: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-IAT`,
        }
      };
    });

    if (this.listToRemoveAttachment.length > 0) {
      this.invoiceService.deleteManyInvoiceAttachment(this.listToRemoveAttachment)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(async (res) => {
          if (res) {
            this.listToRemoveAttachmentFromUpload.map((removeFromUpload) => {
              this.uploadService.deleteFile(removeFromUpload)
                .pipe(takeUntil(this.destroyed$))
                .subscribe((deleted) => {
                  console.log('file deleted', deleted);
                }, (error => {
                  console.error(error);
                }));
            }, (error => {
              console.error(error);
            }));
            await Promise.all(
              listAttachment.map(async resp => {
                if (resp.attachment === '') {
                  resp.attachment = await this.uploadFile(resp['formData']);
                }
              })
            ).then(() => {
              this.invoiceService.addManyInvoiceAttachment(listAttachment)
                .pipe(takeUntil(this.destroyed$))
                .subscribe(() => {
                }, (error => {
                  console.error(error);
                }));
            });
          }
        });
    } else {
      await Promise.all(
        listAttachment.map(async resp => {
          resp.attachment = await this.uploadFile(resp['formData']);
        })
      ).then(() => {
        this.invoiceService.addManyInvoiceAttachment(listAttachment)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
          }, (error => {
            console.error(error);
          }));
      });
    }
  }

  /**************************************************************************
   * @description get label
   * @return list label to pass in pdf
   *************************************************************************/
  getLabel(): object {
    let label: object;
    const translateKey = ['invoice.siteWeb', 'invoice.email', 'invoice.phone', 'invoice.accountsPayable',
      'invoice.totalTTC', 'invoice.Subtotal', 'invoice.BicCode', 'invoice.RIB', 'invoice.IBAN', 'invoice.address',
      'invoice.ConditionAndModality', 'invoice.amountLine', 'invoice.vatLine', 'invoice.quantity',
      'invoice.priceLine', 'invoice.descriptionLine', 'invoice.invoiceTo', 'invoice.dateDeadLine',
      'invoice.dateStart', 'invoice.number', 'invoice.of', 'invoice.title'];
    this.translate.get(translateKey)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        label = {
          title: res['invoice.title'],
          of: res['invoice.of'],
          number: res['invoice.number'],
          dateStart: res['invoice.dateStart'],
          dateDeadLine: res['invoice.dateDeadLine'],
          invoiceTo: res['invoice.invoiceTo'],
          description: res['invoice.descriptionLine'],
          price: res['invoice.priceLine'],
          quantity: res['invoice.quantity'],
          vat: res['invoice.vatLine'],
          amount: res['invoice.amountLine'],
          ConditionAndModality: res['invoice.ConditionAndModality'],
          address: res['invoice.address'],
          IBAN: res['invoice.IBAN'],
          RIB: res['invoice.RIB'],
          BicCode: res['invoice.BicCode'],
          Subtotal: res['invoice.Subtotal'],
          TotalTTC: res['invoice.totalTTC'],
          accountsPayable: res['invoice.accountsPayable'],
          phone: res['invoice.phone'],
          Email: res['invoice.email'],
          SiteWeb: res['invoice.siteWeb'],
        };
      }, (error => {
        console.error(error);
      }));
    return label;
  }

  /**************************************************************************
   * @description generate pdf
   * @param listParamToPassToPDF: list param to pass in pdf
   * @param type: status of invoice( pending, draft, approved ....)
   *************************************************************************/
  generateInvoicePdf(listParamToPassToPDF, type): void {
    this.invoiceService.generateInvoice(listParamToPassToPDF)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async (res) => {
        const file = new File([res], `invoice${listParamToPassToPDF.company.invoiceNbr}.pdf`,
          { lastModified: new Date().getTime(), type: res.type });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('caption', file.name);
        const fileName = await this.uploadFile(formData);
        this.addInvoiceHeader(type, fileName);
        const path = { path: file.name };
        this.invoiceService.deleteInvoice(path)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
          }, (error => {
            console.error(error);
          }));

        if (this.invoiceHeader?.attachment) {
          this.uploadService.deleteImage(this.invoiceHeader.attachment)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((resp) => {
              console.log('deleted pdf', resp);
            }, (error => {
              console.error(error);
            }));
        }
        this.router.navigate(['/manager/invoices']);
      }
      );
  }

  /**************************************************************************
   * @description Generate Invoice
   * @param type: type
   *************************************************************************/
  async generateInvoice(type: string): Promise<void> {
    if (this.buttonAddLine ? this.buttonAddLine['disabled'] : false) {
      alert('error');
    } else {
      this.isLoad.next(true);
      await this.addOrUpdateAttachment();
      this.addOrUpdatePayment();
      this.addOrUpdateInvoiceLine();
      const label: object = this.getLabel();
      const data = Object.values(this.form.value.input).map((invoice) => {
        return {
          description: invoice['project_desc'],
          unit: invoice['invoice_line_unit_amount'],
          quantity: invoice['days_nbr'],
          amount: invoice['invoice_line_total_amount'],
          code: invoice['project_code'],
          vat: invoice['vat_amount'],
        };
      });
      const company = {
        invoiceNbr: this.updateOrAddInvoice === 'update' ? this.invoiceNbr : this.formHeader.value.invoiceNbr,
        name: this.userInfo['company_name'],
        address: this.userInfo['adress'],
        email: this.userInfo['contact_email'],
        phone: this.userInfo['phone_nbr1'],
        siteWeb: this.userInfo['web_site'],
        date: this.datePipe.transform(this.formHeader.value.invoiceDate),
        invoiceDelay: this.datePipe.transform(this.formHeader.value.invoiceDelay),
        imageUrl: environment.uploadFileApiUrl + '/image/' + this.userInfo['photo'],
        detailsBanking: {
          companyBanking: this.formCompanyBanking.value.comment1,
          isFactor: this.formFactor.value.factorInvoice
        }
      };
      const contractor = {
        contractorName: this.contractor['contractor_name'],
        contractorAddress: this.contractor['address'],
      };
      const total = {
        sousTotalHT: this.sousTotalHT,
        vatMount: this.vatMount,
        totalTTC: this.totalTTC,
      };
      const listParmaToPassToPDF = { company, data, contractor, total, label, upload: true };
      if (type === 'PENDING') {
        this.generateInvoicePdf(listParmaToPassToPDF, type);
      } else if (type === 'DRAFT') {
        this.addInvoiceHeader(type);
        this.router.navigate(['/manager/invoices']);
      }
    }
  }

  /**************************************************************************
   * @description Back
   *************************************************************************/
  back(): void {
    this.location.back();
  }

  /**************************************************************************
   * @description Destroy component
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
