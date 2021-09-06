import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICompanyTaxModel } from '@shared/models/companyTax.model';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { Router } from '@angular/router';
import { IContractor } from '@shared/models/contractor.model';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { UploadService } from '@core/services/upload/upload.service';

import { AddTaxCompanyComponent } from '../../tax/add-tax-company/add-tax-company.component';
import { environment } from '../../../../../../../../environments/environment';
declare var require: any;
// tslint:disable-next-line:no-var-requires
const FileSaver = require ('file-saver');
@Component({
  selector: 'wid-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})
export class ListInvoicesComponent implements OnInit, OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<ICompanyTaxModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  listContractor: any;
  emailAddress: string;
  finalMapping = new BehaviorSubject<any>([]);
  allowedActions = [];
  private subscriptions: Subscription[] = [];
  constructor(private userService: UserService,
              private modalService: ModalService,
              private invoiceService: InvoiceService,
              private contractorsService: ContractorsService,
              private uploadService: UploadService,
              private router: Router, ) { }
  /**
   * @description Loaded when component in init state
   */
 async ngOnInit() {
  await this.getContractor();
    this.modalService.registerModals(
      { modalName: 'addTax', modalComponent: AddTaxCompanyComponent });
    this.isLoading.next(true);
    this.getConnectedUser();
    this.getAllInvoices();

  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

   /**************************************************************************
   *  @description : get contractor
   *************************************************************************/
    getContractor(): Promise<IContractor[]> {
      return new Promise((resolve) => {
        this.contractorsService.getContractors(`?email_address=amine.sboui.1@esprit.tn`).subscribe((contractor) => {
          this.listContractor = contractor['results'];
          resolve(this.listContractor);
        });
      });
    }

  /**
   * @description get all invoices by company
   */
  getAllInvoices() {
    this.invoiceService.getInvoiceHeader('?company_email=amine.sboui.1@esprit.tn').subscribe((data) => {
      console.log(data['results'][0]['invoice_status'], 'jjjjj');
      console.log(this.listContractor);
        data['results'].map((datas) => {
          datas['code'] = datas['contractor_code'];
        // tslint:disable-next-line:max-line-length
        datas['contractor_code'] = this.listContractor.find(value => value.contractorKey.contractor_code === datas['contractor_code']).contractor_name;
        if (datas['invoice_status'] === 'DRAFT') {
          datas['action'] = { update: true, delete: true, show: false };
          } else {
          datas['action'] = { update: false, delete: true, show: true };
          }
      });
      this.ELEMENT_DATA.next(data['results']);
      this.isLoading.next(false);
    }, error => console.error(error)
    );
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    console.log(rowAction.data, 'row');
    switch (rowAction.actionType) {
       case ('show'): this.showUser(rowAction.data);
        break;
      case ('update'): this.updateInvoice(rowAction.data);
        break;
       case('download'): this.onChangeStatus(rowAction.data);
       break;
      case('to pay'): this.toPay(rowAction.data);
       break;
      case('archiver'): this.archiver(rowAction.data);
        break;
      case('sendMailing'): this.sendMailing(rowAction.data);
        break;
    }
  }

  /**
   * @description : update invoice
   * @param data: object to update
   */
  updateInvoice(data) {
    this.router.navigate(['/manager/settings/invoices/add-invoice'],
      { state: { nbrInvoice: data.InvoiceHeaderKey.invoice_nbr }
      });
  }
  showUser(data) {
    data.map((invoive) => {
      const fileURL = `${environment.uploadFileApiUrl}/show/` + invoive['attachment'] ;
      window.open(fileURL);
    });

   }

  onChangeStatus(data) {
    data.map((invoice) => {
      const fileURL = `${environment.uploadFileApiUrl}/show/` + invoice['attachment'] ;
      FileSaver.saveAs(fileURL, 'invoice' + invoice['InvoiceHeaderKey']['invoice_nbr'] + '.pdf');
    });

  }

  sendMailing(row) {
    row.map((data) => {
      this.invoiceService.sendInvoiceMail('5eac544ad4cb666637fe1354',
        '5eac544a92809d7cd5dae21f',
        '5ee69e061d291480d44f4cf2',
        'dhia.othmen@widigital-group.com',
        data.contractor_code,
        'data.user_info.actual_job',
        '${environment.uploadFileApiUrl}/show/${data.resume_filename_docx}',
        [{ filename: 'invoice' + data.InvoiceHeaderKey.invoice_nbr + '.pdf',
         path: 'http://192.168.1.22:8067/show/' + data.attachment }, { filename: 'invoice' + data.InvoiceHeaderKey.invoice_nbr + '.pdf',
          path: 'http://192.168.1.22:8067/show/' + data.attachment }]
      ).subscribe(() => {
        this.getAllInvoices();
      });
    });
  }

  archiver(data) {
    data.map((invoice) => {
      const invoiceHeader = {
        application_id: invoice.InvoiceHeaderKey.application_id,
        company_email: invoice.InvoiceHeaderKey.company_email,
        invoice_nbr: invoice.InvoiceHeaderKey.invoice_nbr ,
        invoice_status: 'Rejected',
        factor_involved: invoice.factor_involved,
        invoice_date: invoice.invoice_date,
        invoice_delay: invoice.invoice_delay,
        contractor_code: invoice.code ,
        contract_code: invoice.contract_code,
        vat_amount: invoice.vat_amount,
        invoice_total_amount: invoice.invoice_total_amount,
        invoice_currency: invoice.invoice_currency,
        invoice_amount: invoice.invoice_amount,
        comment1: '',
        comment2: '',
        attachment: invoice.attachment,
      };
      this.invoiceService.updateInvoiceHeader(invoiceHeader).subscribe((res) => {
        console.log(res);
      });

    });
    this.getAllInvoices();
  }

  toPay(data) {
    console.log(data, 'data');
   data.map((invoice) => {
     const invoiceHeader = {
       application_id: invoice.InvoiceHeaderKey.application_id,
       company_email: invoice.InvoiceHeaderKey.company_email,
       invoice_nbr: invoice.InvoiceHeaderKey.invoice_nbr ,
       invoice_status: 'Payed',
       factor_involved: invoice.factor_involved,
       invoice_date: invoice.invoice_date,
       invoice_delay: invoice.invoice_delay,
       contractor_code: invoice.code ,
       contract_code: invoice.contract_code,
       vat_amount: invoice.vat_amount,
       invoice_total_amount: invoice.invoice_total_amount,
       invoice_currency: invoice.invoice_currency,
       invoice_amount: invoice.invoice_amount,
       comment1: '',
       comment2: '',
       attachment: invoice.attachment,
     };
     this.invoiceService.updateInvoiceHeader(invoiceHeader).subscribe((res) => {
       console.log(res);
     });

   });
  this.getAllInvoices();
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
