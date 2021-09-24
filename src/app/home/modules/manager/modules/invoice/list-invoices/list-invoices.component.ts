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
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';

import { environment } from '../../../../../../../environments/environment';
import { ChangePwdInvoiceComponent } from '../change-pwd-invoice/change-pwd-invoice.component';
import { SetPwdInvoiceComponent } from '../set-pwd-invoice/set-pwd-invoice.component';
import { PaymentInvoiceComponent } from '../payment-invoice/payment-invoice.component';

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
  companyEmail: string;
  finalMapping = new BehaviorSubject<any>([]);
  allowedActions = [];
  applicationId: string;
  languageId: string;
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private modalService: ModalService,
              private invoiceService: InvoiceService,
              private contractorsService: ContractorsService,
              private uploadService: UploadService,
              private router: Router,
              private utilsService: UtilsService,
              private localStorageService: LocalStorageService) { }
  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'protectInvoice', modalComponent: ChangePwdInvoiceComponent });
    this.modalService.registerModals(
      { modalName: 'setPwdInvoice', modalComponent: SetPwdInvoiceComponent });
    this.applicationId = this.localStorageService.getItem('userCredentials');
    this.languageId = this.localStorageService.getItem('language').langId;
    this.getConnectedUser();
    await this.getContractor();
    this.modalService.registerModals(
      { modalName: 'PayInvoice', modalComponent: PaymentInvoiceComponent });
    this.isLoading.next(true);
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
            this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
          }
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

  /**
   * @description get all invoices by company
   */
  getAllInvoices() {
    this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmail}`).subscribe((data) => {
        if (data.length === 0) {
          this.ELEMENT_DATA.next(data);
          this.isLoading.next(false);
        } else {
          data['results'].map((invoice) => {
            invoice['code'] = invoice['contractor_code'];
            invoice['contractor_code'] = this.listContractor
              .find(value => value.contractorKey.contractor_code === invoice['contractor_code']).contractor_name;
          });
          this.ELEMENT_DATA.next(data['results']);
          this.isLoading.next(false);
        }

      }, error => console.error(error)
    );
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): this.showInvoice(rowAction.data);
        break;
      case ('update'): this.updateInvoice(rowAction.data);
        break;
      case('download'): this.downloadInvoice(rowAction.data);
        break;
      case('to pay'): this.toPay(rowAction.data);
        break;
      case('archiver'): this.archiver(rowAction.data);
        break;
      case('sendMailing'): this.sendMailing(rowAction.data);
        break;
      case('protect your invoice'): this.protectInvoice(rowAction.data);
        break;
    }
  }

  protectInvoice(data) {
    this.modalService.displayModal('protectInvoice', data,
      '500px', '344px').subscribe(async (res) => {
      if (res) {
      }
    });
  }

  /**
   * @description : update invoice
   * @param data: object to update
   */
  updateInvoice(data) {
    if (data.password) {
      this.modalService.displayModal('setPwdInvoice', data,
        '500px', '255px').subscribe(async (res) => {
        if (res) {
          this.router.navigate(['/manager/invoices/add-invoice'],
            { state: { nbrInvoice: data.InvoiceHeaderKey.invoice_nbr }
            });
        } else {
          console.log('error');
        }
      });
    } else {
      this.router.navigate(['/manager/invoices/add-invoice'],
        { state: { nbrInvoice: data.InvoiceHeaderKey.invoice_nbr }
        });
    }
  }

  /**
   * @description : show invoice
   * @param data: invoice to show
   */
  showInvoice(data) {
    data.map((invoive) => {
      const fileURL = `${environment.uploadFileApiUrl}/show/` + invoive['attachment'] ;
      window.open(fileURL);
    });
  }

  /**
   * @description : download invoice
   * @param data: invoice to show
   */
  downloadInvoice(data) {
    data.map((invoice) => {
      const fileURL = `${environment.uploadFileApiUrl}/show/` + invoice['attachment'] ;
      FileSaver.saveAs(fileURL, 'invoice' + invoice['InvoiceHeaderKey']['invoice_nbr'] + '.pdf');
    });

  }

  /**
   * @description : send mailing
   * @param row: list invoices to send
   */
  sendMailing(row) {
    row.map((data) => {
      this.invoiceService.sendInvoiceMail(this.languageId,
        this.applicationId,
        this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
        this. companyEmail,
        data.contractor_code,
        'data.user_info.actual_job',
        '${environment.uploadFileApiUrl}/show/${data.resume_filename_docx}',
        [{ filename: 'invoice' + data.InvoiceHeaderKey.invoice_nbr + '.pdf',
          path: environment.uploadFileApiUrl + '/show/' + data.attachment }]
      ).subscribe(() => {
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
    this.modalService.displayModal('PayInvoice', data,
      '500px', '580px').subscribe(async (res) => {
      if (res) {
      }
    });
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
      /* this.invoiceService.updateInvoiceHeader(invoiceHeader).subscribe((res) => {
         console.log(res);
       });*/

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
