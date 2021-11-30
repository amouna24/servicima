import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { UploadService } from '@core/services/upload/upload.service';
import { ProjectCollaboratorService } from '@core/services/project-collaborator/project-collaborator.service';
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
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { HolidayService } from '@core/services/holiday/holiday.service';

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

import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'wid-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent implements OnInit {
  applicationId: string;
  companyEmail: string;
  companyId: string;
  userInfo: IUserInfo;
  listUsers: IUserModel[];
  contractorAddress: string;
  contractorName: string;
  contract: IContract;
  contractorId: string;
  contractorCode: string;
  contractCode: string;
  contractorEmailAddress: string;
  editContractors = false;
  contractorSelected = false;
  listProject: IContractProject[];
  listContractor: IContractor[];
  listContract: IContract[];
  companyBankingInfos: ICompanyBankingInfoModel;
  paymentTerms: number;
  avatar: any;
  invoices: Array<{ }>;
  invoiceLine: IInvoiceLineModel;
  invoiceHeader: IInvoiceHeaderModel;
  invoicePayment: IInvoicePaymentModel[] = [];
  invoiceAttachment: IInvoiceAttachmentModel[] = [];
  maxInvoiceHeader: number;
  isLoading = new BehaviorSubject<boolean>(true);
  isLoad = new BehaviorSubject<boolean>(false);
  form: FormGroup;
  formFactor: FormGroup;
  formHeader: FormGroup;
  formCompanyBanking: FormGroup;
  invoiceNbr: number;
  statusInvoice: string;
  sousTotalHT = 0;
  vatMount = 0;
  totalTTC = 0;
  vat: number;
  mp: object;
  translateKey: string[];
  action: string;
  factorInvoice = false;
  currencyCode: string;
  totalPayments = 0;
  leftToPay: number;
  showPayment = false;
  showAttachmentFile = false;
  iconVisible: boolean;
  paymentMethodsList: IViewParam[];
  listToRemovePayment: string[] = [];
  listToRemoveAttachment: string[] = [];
  tableColumns: string[] = ['Entered By', 'Type', 'Notes', 'Date', 'Amount', 'Action'];
  tableColumns1: string[] = ['File Title', 'Size', 'Date', 'Action'];
  data: MatTableDataSource<any> = new MatTableDataSource([]);
  data1: MatTableDataSource<any> = new MatTableDataSource([]);
  contractRate: number;
  sundayRate: string;
  holidayRate: string;
  saturdayRate: string;
  overtimePerDayRate: string;
  listToRemoveAttachmentFromUpload: string[] = [];
  emailAddress: string;
  @ViewChild('table1', { read: MatSort, static: false }) sort: MatSort;
  @ViewChild('table2', { read: MatSort, static: false }) sort1: MatSort;
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
              private projectCollaboratorService: ProjectCollaboratorService,
              private translate: TranslateService,
              private timesheetService: TimesheetService,
              private paymentTermsService: CompanyPaymentTermsService,
              private holidayService: HolidayService,
              private contractorsService: ContractorsService,
              private timesheetHoliday: HolidayService,
              private http: HttpClient,
              private localStorageService: LocalStorageService) {
    this.invoiceNbr = this.router.getCurrentNavigation()?.extras?.state?.nbrInvoice;
  }

  /**************************************************************************
   *  @description Loaded when component in init state
   *************************************************************************/
  async ngOnInit() {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.emailAddress = this.localStorageService.getItem('userCredentials').email_address;
    this.translateKey = ['invoice.siteWeb', 'invoice.email', 'invoice.phone', 'invoice.accountsPayable',
      'invoice.totalTTC', 'invoice.Subtotal', 'invoice.BicCode', 'invoice.RIB', 'invoice.IBAN', 'invoice.address',
      'invoice.ConditionAndModality', 'invoice.amountLine', 'invoice.vatLine', 'invoice.quantity',
      'invoice.priceLine', 'invoice.descriptionLine', 'invoice.invoiceTo', 'invoice.dateDeadLine',
      'invoice.dateStart', 'invoice.number', 'invoice.of', 'invoice.title'];
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
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent},
      ]);
  }

  /**************************************************************************
   *  @description : initialization of the form
   *************************************************************************/
  initForm() {
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
 async viewData() {
   this.sheetService.displaySheet('uploadSheetComponent', null)
     .subscribe(
       async (res) => {
         if (!!res) {
           const file = res['selectedFiles'][0];
           const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
           const file1 = new File([res['selectedFiles'][0]], res.name, {
             lastModified: new Date().getTime(),
             type: res['selectedFiles'][0].type
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
           this.data1 = new MatTableDataSource(this.invoiceAttachment);
         }
       });
 }

  /**************************************************************************
   * Format the size to a human readable string
   * @param bytes: number
   * @returns the formatted string e.g. `105 kB` or 25.6 MB
   *************************************************************************/
   formatBytes(bytes: number) {
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
   *************************************************************************/
  async getUsers() {
    return new Promise((resolve) => {
      this.userService.getAllUsers(`?company_email=${this.companyEmail}`).subscribe((data) => {
        this.listUsers = data['results'];
        resolve(this.listUsers);
      });
    });
  }

  /**
   * @description : show attachment
   * @param row: invoice attachment
   */
  showAttachment(row: IInvoiceAttachmentModel) {
    const  path = environment.uploadFileApiUrl + '/show/' + row['attachment'];
    window.open(path);
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefData() {
    const list = ['PAYMENT_MODE'];
    const refData = await this.refDataService.getRefData(this.companyId, this.applicationId,
      list);
    this.paymentMethodsList = refData['PAYMENT_MODE'];
  }

  /**
   * @description : refresh invoice payment
   */
  refreshPayment() {
    this.data = new MatTableDataSource<any>(this.invoicePayment);
    this.data.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Entered By': {
          return item.Entred.toLowerCase();
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
    this.data.sort = this.sort;
  }

  /**
   * @description : refresh invoice payment
   */
  refreshInvoiceAttachment() {
    this.data1 = new MatTableDataSource<any>(this.invoiceAttachment);
    this.data1.sortingDataAccessor = (item, property) => {
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
    this.data1.sort = this.sort1;
  }

  /**
   * @description : Enter payment
   */
  enterPayment() {
    this.refreshPayment();
    this.showAttachmentFile = false;
    this.showPayment = !this.showPayment;
  }

  /**
   * @description : delete attachment
   */
  deleteAttachment(row, attachment: string) {

    this.listToRemoveAttachmentFromUpload.push(attachment);
    if (attachment) {
      this.invoiceAttachment = this.invoiceAttachment.filter((data) => {
       if ( data.InvoiceAttachmentKey?.code_attachment  !== row.InvoiceAttachmentKey?.code_attachment) {
       return data;
       }
     });
    } else {
      this.invoiceAttachment =  this.invoiceAttachment.filter((data) => {
        if ( data['code_attachment']  !== row.code_attachment) {
          return data;
        }
      });
    }

    this.data1 = new MatTableDataSource<any>(this.invoiceAttachment);
  }

  /**
   * @description : show attachment
   */
  showAttach() {
    this.refreshInvoiceAttachment();
    this.showPayment = false;
    this.showAttachmentFile = !this.showAttachmentFile;
  }

  /**
   * @description : count  payment
   */
  countPayment() {
    this.leftToPay = this.totalTTC;
    this.totalPayments = 0;
    this.invoicePayment.map((data) => {
      this.totalPayments =  this.totalPayments + parseInt(data['invoice_line_unit_amount'], 10);
    });
    this.countLeftToPay();
  }

  /**************************************************************************
   *  @description : count left to pay
   *************************************************************************/
  countLeftToPay() {
    this.leftToPay = this.totalTTC - this.totalPayments;
  }

  /**************************************************************************
   *  @description : set company banking info
   *************************************************************************/
  setCompanyBankingInfo() {
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
  showInfoContractor() {
    this.router.navigate(
      ['/manager/contract-management/suppliers-contracts/suppliers'],
      {
        queryParams: {
          id: btoa(this.contractorId),
          cc: btoa(this.contractorCode),
          ea: btoa(this.contractorEmailAddress)
        }
      });
  }

  /**************************************************************************
   *  @description : set the value of the form if it was an update user
   *************************************************************************/
  async  setForm() {
    this.invoiceHeader = this.invoices[0]['results'][0];
    this.invoiceLine = this.invoices[2] as IInvoiceLineModel;
    this.contractCode = this.invoiceHeader['contract_code'];
    this.currencyCode = this.invoiceHeader['invoice_currency'];
    this.statusInvoice = this.invoiceHeader['invoice_status'];
    this.editContractors = false;
    await this.getContract(this.invoiceHeader['contractor_code']);

    this.getContractProject(this.invoiceHeader['contract_code']);

    this.countPayment();
    this.formFactor.controls['factorInvoice'].setValue(this.invoiceHeader ['factor_involved'] === 'Y');
    this.mp = { ...this.invoiceLine };
    this.maxInvoiceHeader = this.invoices[2]['max'] ? parseInt(this.invoices[2]['max'], 10) + 1 : 1;
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
  editContractor() {
    this.editContractors = true;
  }

  /**************************************************************************
   * @description Get connected user
   *************************************************************************/
  async getConnectedUser() {
    return new Promise((resolve) => {
      this.userService.connectedUser$
        .subscribe(
          async (userInfo) => {
            if (userInfo) {
              this.companyId = userInfo['company'][0]['_id'];
              this.userInfo = userInfo['company'][0];
              this.avatar = await this.uploadService.getImage(this.userInfo['photo']);
              this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
              resolve(this.companyEmail);
            }
          });
    });
  }

  /**************************************************************************
   *  @description : get invoice number
   *************************************************************************/
  async getInvoiceNbr(): Promise<void> {

    if (this.invoiceNbr) {
      this.action = 'update';
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
      this.action = 'add';
      const maxInvoiceNbr = await this.getMaxHeaderInvoiceNbr() as string;
      this.invoiceNbr = maxInvoiceNbr ? parseInt(maxInvoiceNbr, 10) + 1 : 1;
      this.formHeader.controls['invoiceNbr'].setValue(this.invoiceNbr);
      this.formHeader.controls['invoiceDate'].setValue(this.datePipe.transform(new Date()));
    }
  }

  /**************************************************************************
   *  @description : get attachment invoice
   *************************************************************************/
  getAttachmentInvoice() {
    return   new Promise((resolve) => {
      this.invoiceService.getInvoiceAttachment(`?company_email=${this.companyEmail}&invoice_nbr=` + this.invoiceNbr).subscribe((data) => {
        this.invoiceAttachment = data;
        this.invoiceAttachment.map((res) => {
            this.listToRemoveAttachment.push(res['_id']);

        });
        resolve(this.invoiceAttachment);
      });
    });
  }

  /**************************************************************************
   *  @description : get contractor
   *************************************************************************/
  getContractor(): Promise<IContractor[]> {
    return new Promise((resolve) => {
      this.contractorsService.getContractors(`?email_address=${this.companyEmail}`).subscribe((contractor) => {
        this.listContractor = contractor['results'];
        resolve(this.listContractor);
      });
    });
  }

  /**************************************************************************
   *  @description : get contract
   *  @param contractorCode: contract code
   *************************************************************************/
  getContract(contractorCode: string) {
    return new Promise((resolve) => {
      this.contractorSelected = true;
      this.vat = parseInt(this.listContractor.find(value => value.contractorKey.contractor_code === contractorCode).vat_nbr, 10);
      this.contractorName = this.listContractor.find(value => value.contractorKey.contractor_code === contractorCode).contractor_name;
      this.contractorId = this.listContractor.find(value => value.contractorKey.contractor_code === contractorCode)._id;
      this.contractorAddress = this.listContractor.find(value => value.contractorKey.contractor_code === contractorCode).address;
      this.contractorEmailAddress = this.listContractor.find(value => value.contractorKey.contractor_code === contractorCode)
        .contractorKey.email_address;
      this.contractorCode = contractorCode;
      this.contractsService.getContracts(`?email_address=${this.companyEmail}&contractor_code=${contractorCode}`)
        .subscribe((contract) => {
          if (contract['results']) {
            this.listContract = contract['results'];
            resolve(this.listContract);
          }
        });
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
    this.contractRate = this.contract['contract_rate'];
    this.paymentTermsService.getCompanyPaymentTerms(`${this.companyEmail}`, 'ACTIVE').subscribe((data) => {
      this.paymentTerms = data.find(value => value.companyPaymentTermsKey.payment_terms_code === this.contract['payment_terms']).delay;
      this.formHeader.controls['invoiceDelay'].
      setValue(this.paymentTerms ? this.datePipe.transform(new Date().setDate(new Date().getDate() + this.paymentTerms)) : null);
    });
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
  mouseEnter() {
    this.iconVisible = true;
  }

  /**************************************************************************
   *  @description mouse leave
   *************************************************************************/
  mouseLeave() {
    this.iconVisible = false;
  }

  /**************************************************************************
   *  @description Get Contract Project
   *  @param contractCode: string
   *************************************************************************/
  getContractProject(contractCode: string): void {
    this.contractProjectService.getContractProject(`${this.companyEmail}`, contractCode).subscribe((data) => {
      this.listProject = data;
    });
  }

  /**************************************************************************
   *  @description Get Company Banking Info
   *************************************************************************/
  getCompanyBankingInfo(): void {
    this.companyBankingInfo.getCompanyBankingInfo(this.userInfo['companyKey'].email_address).subscribe((data) => {
      this.companyBankingInfos = data[0];
      if ( this.invoiceHeader?.comment1) {
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
    });

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
  toPay() {
    this.showAttachmentFile = false;
    const data = {
      application_id: this.applicationId,
      company_email: this.companyEmail,
      invoice_nbr: this.invoiceNbr
    };
    this.modalService.displayModal('PayInvoice', data,
      '500px', '580px').subscribe(async (res) => {
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
    });

  }

  /**************************************************************************
   *  @description Get Invoice
   *************************************************************************/
  async getInvoice(): Promise<void> {
    const promise1 = new Promise((resolve) => {
      this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmail}&invoice_nbr=` + this.invoiceNbr).subscribe((invoiceHeader) => {
        resolve(invoiceHeader);
      }, () => {
        resolve([]);
      });
    });

    const promise2 = new Promise((resolve) => {
      this.invoiceService.getInvoicePayment(`?company_email=${this.companyEmail}&invoice_nbr=` + this.invoiceNbr).subscribe((invoicePayment) => {
        this.mapInvoicePayment(invoicePayment);
        if (invoicePayment.length > 0 ) {
          invoicePayment.map((data) => {
            this.listToRemovePayment.push(data['_id']);
          });
        }
        resolve(invoicePayment);
      }, () => {
        resolve([]);
      });
    });

    const promise3 = new Promise((resolve) => {
      this.invoiceService.getInvoiceLine(`?company_email=${this.companyEmail}&invoice_nbr=${this.invoiceNbr}`).subscribe((invoiceLine) => {
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
   *************************************************************************/
  mapInvoicePayment(invoicePayment: IInvoicePaymentModel[]) {
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
  async getMaxHeaderInvoiceNbr() {
    return new Promise((resolve) => {
      this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmail}`).subscribe((invoiceHeader) => {
        this.maxInvoiceHeader = invoiceHeader['max'];
        resolve(this.maxInvoiceHeader);
      }, () => {
        resolve(null);
      });
    });
  }

  /**************************************************************************
   *  @description add Invoice Line
   *************************************************************************/
  addInvoiceHeader(type: string, valueAttachment?: string) {
    const invoiceHeader = {
      application_id: this.applicationId,
      company_email: this.companyEmail,
      invoice_nbr: this.action === 'update' ? this.invoiceNbr : parseInt(this.formHeader.value.invoiceNbr, 10),
      invoice_status: type,
      factor_involved: this.formFactor.value.factorInvoice ? 'Y' : 'N',
      invoice_date: this.formHeader.value.invoiceDate,
      invoice_delay: this.formHeader.value.invoiceDelay,
      contractor_code: this.contractorCode,
      contract_code: this.contractCode,
      vat_amount: this.vatMount,
      invoice_total_amount: this. totalTTC,
      invoice_currency: this.currencyCode,
      invoice_amount: this.sousTotalHT,
      comment1: this.formCompanyBanking.value.comment1,
      comment2: '',
      attachment: valueAttachment ? valueAttachment : '',
      password: '12345',
      old_password: '12345'
    };
    if (!this.invoiceHeader) {
      this.invoiceService.addInvoiceHeader(invoiceHeader).subscribe((data) => {
        this.invoiceHeader = data[0];
      });
    } else {
      this.invoiceService.updateInvoiceHeader(invoiceHeader).subscribe((data) => {
        this.invoiceHeader = data[0];
      });
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
  getListRole() {
    return this.form.get('input') as FormArray;
  }

  /**************************************************************************
   * @description  add new line invoice
   *************************************************************************/
  onAddAnotherLine() {
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
  getListInvoiceLine() {
    const listLine = this.form.value.input.map((res) => {
      return {
        ...res,
        InvoiceLineKey: {
          company_email: this.companyEmail,
          invoice_nbr: this.action === 'update' ? this.invoiceNbr : parseInt(this.formHeader.value.invoiceNbr, 10),
          application_id: this.applicationId,
          invoice_line_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-ILC`,
        }
      };
    });
    return listLine;
  }

  /**************************************************************************
   * @description Generate Invoice
   *************************************************************************/
  async generateInvoice(type: string) {
  this.isLoad.next(true);
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
      this.invoiceService.deleteManyInvoiceAttachment(this.listToRemoveAttachment).subscribe(async (res) => {
        if (res) {
          this.listToRemoveAttachmentFromUpload.map((removeFromUpload) => {
            this.uploadService.deleteFile(removeFromUpload).subscribe((deleted) => {
              console.log('file deleted', deleted);
            });
          });
          await Promise.all(
            listAttachment.map(async resp => {
              if (resp.attachment === '') {
                const fileNames = await this.uploadFile(resp['formData']);
                resp.attachment = fileNames;
              }
            })
          ).then(() => {
            this.invoiceService.addManyInvoiceAttachment(listAttachment).subscribe(() => {
            });
          });
        }
      });
    } else {
      await Promise.all(
        listAttachment.map(async resp => {
          const fileNames = await this.uploadFile(resp['formData']);
          resp.attachment = fileNames;
        })
      ).then(() => {
        this.invoiceService.addManyInvoiceAttachment(listAttachment).subscribe(() => {
        });
        /*  this.invoiceService.addManyInvoiceAttachment(listAttachment).subscribe((res) => {
          });*/
      });
    }

      if (this.invoicePayment.length > 0 ) {
          this.invoiceService.deleteManyInvoicePayment(this.listToRemovePayment).subscribe((res) => {
            if (res) {
              this.invoiceService.addManyInvoicePayment(this.invoicePayment).subscribe((resp) => {
              });
            }
          });
        } else {
          this.invoiceService.addManyInvoicePayment(this.invoicePayment).subscribe((res) => {
          });
        }

        let listToRemove = [];
        let listLine = [];
        if (this.mp === { } || !this.mp) {
          listLine = this.getListInvoiceLine();
          this.invoiceService.addManyInvoiceLine(listLine).subscribe(() => {
          });
        } else {
          listLine = this.getListInvoiceLine();

          listToRemove = Object.values(this.mp).map((res) => {
            return res['_id'];
          });

          this.invoiceService.deleteManyInvoiceLine(listToRemove).subscribe(() => {
            this.invoiceService.addManyInvoiceLine(listLine).subscribe(() => {
              this.invoiceService.getInvoiceLine(`?company_email=${this.companyEmail}&invoice_nbr=${this.formHeader.value.invoiceNbr}`)
                .subscribe((invoice) => {
                  if (invoice) {
                    this.mp = invoice;
                  }
                });
            });
          });
        }

        let label: object;
        const data = Object.values(this.form.value.input).map((invoice) => {
          return {
            description: invoice['project_desc'],
            unit: invoice['invoice_line_unit_amount'],
            quantity: invoice['days_nbr'],
            //   price: invoice['invoice_amount'],
            amount: invoice['invoice_line_total_amount'],
            code: invoice['project_code'],
            vat: invoice['vat_amount'],
          };
        });

        this.translate.get(this.translateKey).subscribe(res => {
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
        });

        const company = {
          invoiceNbr: this.action === 'update' ? this.invoiceNbr : this.formHeader.value.invoiceNbr,
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
          contractorName: this.contractorName,
          contractorAddress: this.contractorAddress,
        };

        const total = {
          sousTotalHT: this.sousTotalHT,
          vatMount: this.vatMount,
          totalTTC: this.totalTTC,
        };

        const final = { company, data, contractor, total, label, upload: true };
        if (type === 'PENDING') {
          this.invoiceService.generateInvoice(final).subscribe(async (res) => {
              const file = new File([res], `invoice${company.invoiceNbr}.pdf`, { lastModified: new Date().getTime(), type: res.type });
              const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
              formData.append('file', file);
              formData.append('caption', file.name);
              const fileName = await this.uploadFile(formData);
              this.addInvoiceHeader(type, fileName);
              const path = { path: file.name };
              this.invoiceService.deleteInvoice(path).subscribe(() => {
              });
              this.uploadService.deleteImage(this.invoiceHeader.attachment).subscribe((resp) => {
                console.log('deleted pdf', resp);
              });
              this.router.navigate(['/manager/invoices']);
            }
          );
        } else if (type === 'DRAFT') {
          this.addInvoiceHeader(type);
          this.router.navigate(['/manager/invoices']);
        }

  }

  /**************************************************************************
   * @description Delete payment
   * @param row: row of payment invoice
   *************************************************************************/
  deletePayment(row: IInvoicePaymentModel) {
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
   * @description Upload Image to Server
   *************************************************************************/
  async uploadFile(formData: FormData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }

  /**************************************************************************
   * @description Back
   *************************************************************************/
  back() {
    this.location.back();
  }

}
