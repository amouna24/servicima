import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DatePipe } from '@angular/common';

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

import { IContractProject } from '@shared/models/contractProject.model';
import { IContractor } from '@shared/models/contractor.model';
import { IContract } from '@shared/models/contract.model';
import { ICompanyBankingInfoModel } from '@shared/models/companyBankingInfo.model';
import { IUserInfo } from '@shared/models/userInfo.model';

import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'wid-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  applicationId: string;
  userInfo: IUserInfo;
  contractorAddress: string;
  contractorName: string;
  companyBankingInfos: ICompanyBankingInfoModel;
  contract: any;
  paymentTerms: number;
  avatar: any;
  maxInvoiceHeader: number;
  listProject: IContractProject[];
  listContractor: IContractor[];
  listContract: IContract[];
  invoices: Array<{ }>;
  invoiceLine: object;
  invoiceHeader: object;
  form: FormGroup;
  formFactor: FormGroup;
  formHeader: FormGroup;
  formCompanyBanking: FormGroup;
  companyEmail: string; // A changer
  contractorCode: string;
  contractCode: string;
  invoiceNbr: number;

  sousTotalHT = 0;
  vatMount = 0;
  totalTTC = 0;
  vat: number;
  contractorId: string;

  mp: object;
  contractorEmailAddress: string;
  editContractors = false;
  contractorSelected = false;
  translateKey: string[];
  iconVisible: boolean;
  action: string;
  factorInvoice = false;
  currencyCode: string;

  constructor(private invoiceService: InvoiceService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private modalService: ModalService,
    private companyBankingInfo: CompanyBankingInfoService,
    private contractsService: ContractsService,
    private contractProjectService: ContractProjectService,
    private uploadService: UploadService,
    private router: Router,
    private projectCollaboratorService: ProjectCollaboratorService,
    private translate: TranslateService,
    private paymentTermsService: CompanyPaymentTermsService,
    private contractorsService: ContractorsService,
    private localStorageService: LocalStorageService) {
    this.invoiceNbr = this.router.getCurrentNavigation()?.extras?.state?.nbrInvoice;
  }

  /**************************************************************************
   *  @description Loaded when component in init state
   *************************************************************************/
   async ngOnInit() {
    this.applicationId = this.localStorageService.getItem('userCredentials');
    this.translateKey = ['invoice.siteWeb', 'invoice.email', 'invoice.phone', 'invoice.accountsPayable',
      'invoice.totalTTC', 'invoice.Subtotal', 'invoice.BicCode', 'invoice.RIB', 'invoice.IBAN', 'invoice.address',
      'invoice.ConditionAndModality', 'invoice.amountLine', 'invoice.vatLine', 'invoice.quantity',
      'invoice.priceLine', 'invoice.descriptionLine', 'invoice.invoiceTo', 'invoice.dateDeadLine',
      'invoice.dateStart', 'invoice.number', 'invoice.of', 'invoice.title'];
    this.initForm();
    this.getConnectedUser();
    await this.getContractor();
    await this.getInvoiceNbr();
    this.getCompanyBankingInfo();
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
  setForm() {
    this.invoiceHeader = this.invoices[0]['results'][0];
    this.invoiceLine = this.invoices[2];
    this.contractCode = this.invoiceHeader['contract_code'];
    this.currencyCode = this.invoiceHeader['invoice_currency'];
    this.editContractors = false;
    this.getContract(this.invoiceHeader['contractor_code']);
    this.getContractProject(this.invoiceHeader['contract_code']);
    // this.getTimesheet(this.invoiceHeader['contract_code']);

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
  getConnectedUser(): void {
    this.userService.connectedUser$
      .subscribe(
        async (userInfo) => {
          if (userInfo) {
            this.userInfo = userInfo['company'][0];
            this.avatar = await this.uploadService.getImage(this.userInfo['photo']);
            this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  /**************************************************************************
   *  @description : get invoice number
   *************************************************************************/
  async getInvoiceNbr(): Promise<void> {
    if (this.invoiceNbr) {
      this.action = 'update';
      await this.getInvoice();
      this.setForm();
      this.formHeader.get('invoiceNbr').disable();
      this.formHeader.patchValue({ invoiceNbr: this.invoiceNbr });
    } else {
      this.action = 'add';
      const maxInvoiceNbr = await this.getMaxHeaderInvoiceNbr() as string;
      this.invoiceNbr = maxInvoiceNbr ? parseInt(maxInvoiceNbr, 10) + 1 : 1;
      this.formHeader.controls['invoiceNbr'].setValue(this.invoiceNbr);
      this.formHeader.controls['invoiceDate'].setValue(this.datePipe.transform(new Date()));
    }
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
  getContract(contractorCode: string): void {
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
        }
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
        preTotal
        ;
      const vat = (total * this.vat) / 100;
      const formArr = this.form.controls['input'] as FormArray;
      formArr.controls[i].patchValue({ invoice_line_total_amount: isNaN(total) ? 'error' : total });
      formArr.controls[i].patchValue({ vat_amount: isNaN(vat) ? 'error' : vat });
      this.sousTotalHT = this.getSum('invoice_line_total_amount');
      this.vatMount = this.getSum('vat_amount');
      this.totalTTC = this.getSum('vat_amount') + this.getSum('invoice_line_total_amount');
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
    this.paymentTermsService.getCompanyPaymentTerms(`${this.companyEmail}`).subscribe((data) => {
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
    //  this.getTimesheet(this.companyEmail,);
  }

  /**************************************************************************
   *  @description Get Timesheet
   *************************************************************************/
  getTimesheet(companyEmail: string, contractCode: string, emailAddress: string, week: string): void {
    /*this.timesheetService
      .getTimesheet(`?company_email=${companyEmail}&email_address=${emailAddress}&project_code=${contractCode}&timesheet_week=${week}`)
      .subscribe((timesheet) => {
      });*/
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
   *************************************************************************/
  getProjectCollab(contractCode: string): void {
    this.projectCollaboratorService.getProjectCollaborator(`${this.companyEmail}`, contractCode).subscribe((projectCollab) => {
      const listCollaborator = projectCollab.map((data) => {
        return data.ProjectCollaboratorKey.email_address;
      });
      listCollaborator.map((data) => {
        // this.getTimesheet(this.companyEmail, this.contractCode, data, '2021-05-31T23:00:00.000Z');
      });
    });
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
      if (!this.formFactor.value.factorInvoice) {
        this.formCompanyBanking.controls['comment1'].setValue(`Bank domiciliation: ${this.companyBankingInfos?.bank_domiciliation}
Name: ${this.companyBankingInfos?.bank_name}
Adresse: ${this.companyBankingInfos?.bank_address}
BIC CODE: ${this.companyBankingInfos?.bic_code}
BAN: ${this.companyBankingInfos?.iban}
RIB:${this.companyBankingInfos?.rib}`);
      } else {
        this.formCompanyBanking.controls['comment1'].setValue(`${this.companyBankingInfos?.factor_informations}`);
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

  /* const promise2 = new Promise((resolve) => {
      this.invoiceService.getInvoicePayment(`?company_email=${this.companyEmail}&invoice_nbr=` + this.invoiceNbr).subscribe((invoicePayment) => {
        resolve(invoicePayment);
      }, () => {
        resolve([]);
      });
    });*/

    const promise3 = new Promise((resolve) => {
      this.invoiceService.getInvoiceLine(`?company_email=${this.companyEmail}&invoice_nbr=${this.invoiceNbr}`).subscribe((invoiceLine) => {
        resolve(invoiceLine);
      }, () => {
        resolve([]);
      });
    });

    return Promise.all([promise1, [], promise3]).then((values) => {
      this.invoices = values;
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
      }, error => {
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
    // this.getProjectCollab(project['ContractProjectKey']['project_code']);
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
  generateInvoice(type: string): void {
      let dhaw = [];
      let listLine = [];
      if (this.mp === { } || !this.mp) {
        listLine = this.getListInvoiceLine();
        this.invoiceService.addManyInvoiceLine(listLine).subscribe(() => {
        });
      } else {
        listLine = this.getListInvoiceLine();

        dhaw = Object.values(this.mp).map(() => {
          return data['_id'];
        });

        this.invoiceService.deleteManyInvoiceLine(dhaw).subscribe(() => {
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
          companyBanking: this.formHeader.value.comment1,
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

      const final = { company, data, contractor, total, label };
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
          this.router.navigate(['/manager/settings/invoices']);
        }
        );
      } else if (type === 'DRAFT') {
        this.addInvoiceHeader(type);
        this.router.navigate(['/manager/settings/invoices']);
      }
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

}
