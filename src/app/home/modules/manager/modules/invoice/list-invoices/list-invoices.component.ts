import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import xml2js from 'xml2js';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { Router } from '@angular/router';
import { IContractor } from '@shared/models/contractor.model';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { UploadService } from '@core/services/upload/upload.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MailingModalComponent } from '@shared/components/mailing-modal/mailing-modal.component';
import { FileSaver } from 'file-saver';
import { IInvoiceHeaderModel } from '@shared/models/invoiceHeader.model';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { SheetService } from '@core/services/sheet/sheet.service';
import { environment } from '@environment/environment';
import { takeUntil } from 'rxjs/operators';

import { ChangePwdInvoiceComponent } from '../change-pwd-invoice/change-pwd-invoice.component';
import { SetPwdInvoiceComponent } from '../set-pwd-invoice/set-pwd-invoice.component';
import { PaymentInvoiceComponent } from '../payment-invoice/payment-invoice.component';

@Component({
  selector: 'wid-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})
export class ListInvoicesComponent implements OnInit, OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<IInvoiceHeaderModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  listContractor: any;
  companyEmail: string;
  finalMapping = new BehaviorSubject<any>([]);
  allowedActions = [];
  applicationId: string;
  languageId: string;
  public xmlItems: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  subscriptionModal: Subscription;
  constructor(private userService: UserService,
              private modalService: ModalService,
              private invoiceService: InvoiceService,
              private contractorsService: ContractorsService,
              private uploadService: UploadService,
              private router: Router,
              private modalServices: ModalService,
              private utilsService: UtilsService,
              private sheetService: SheetService,
              private localStorageService: LocalStorageService,
              private http: HttpClient) { }
  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'protectInvoice', modalComponent: ChangePwdInvoiceComponent });
    this.modalService.registerModals(
      { modalName: 'setPwdInvoice', modalComponent: SetPwdInvoiceComponent });
    this.modalService.registerModals({ modalName: 'mailing', modalComponent: MailingModalComponent });
    this.applicationId = this.localStorageService.getItem('userCredentials');
    this.languageId = this.localStorageService.getItem('language').langId;
    this.getConnectedUser();
    await this.getContractor();
    this.modalService.registerModals(
      { modalName: 'PayInvoice', modalComponent: PaymentInvoiceComponent });
    this.isLoading.next(true);
    this.getAllInvoices();
    this.sheetService.registerSheets(
      [
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent},
      ]);
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$.pipe(takeUntil(this.destroyed$))
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
    this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmail}`)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
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
      case('archiver'): this.archiver(rowAction.data);
        break;
      case('sendMailing'): this.sendMailing(rowAction.data);
        break;
      case('import'): this.loadXML();
        break;
    }
  }

  /**
   * @description : update invoice
   * @param data: object to update
   */
  updateInvoice(data) {
      this.router.navigate(['/manager/invoices/add-invoice'],
        { state: { nbrInvoice: data.InvoiceHeaderKey.invoice_nbr }
        });
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
    this.subscriptionModal = this.modalServices.displayModal('mailing', row, '500px', '640px')
      .subscribe(
        (res) => {
          console.log('mailing dialog', res);
          this.subscriptionModal.unsubscribe();
        });

  }

  /**
   * @description : archive invoice
   * @param data: invoice to archive
   */
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
      this.invoiceService.updateInvoiceHeader(invoiceHeader).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        console.log(res);
      });

    });
    this.getAllInvoices();
  }

  /**
   * @description load xml
   */
  loadXML() {
    this.sheetService.displaySheet('uploadSheetComponent', { acceptedFormat: '.xml'})
      .pipe(takeUntil(this.destroyed$)).subscribe(
        async (res) => {
          if (res) {
            const reader = new FileReader();
            reader.onload = () => {
              this.parseXML(reader.result)
                .then((xml) => {
                  this.xmlItems = xml;
                  this.getAllInvoices();
                });
            };
            reader.readAsText(res.selectedFile);
          }
        });
  }

  /**
   * @description parse xml
   */
  parseXML(data) {
    const companyEmail = this.companyEmail;
    const listContractor = this.listContractor;
    return new Promise(resolve => {
      const  arr = [];
      const  parser = new xml2js.Parser({
        trim: true,
        explicitArray: true
      });
      parser.parseString(data, (err, result) => {
        result.invoices.invoice.map((resp) => {
          const contractorCode =  listContractor.find(value => value.contractor_name  === 'Adele Willis').contractorKey.contractor_code;

          console.log(resp);
          const invoiceHeader = {
            application_id: this.applicationId,
            company_email: companyEmail,
            invoice_nbr: resp.no[0],
            invoice_status: resp.status[0],
            factor_involved: 'N',
            invoice_date: new Date(),
            invoice_delay: new Date(),
            contractor_code: contractorCode,
            contract_code: 'AZE21T8',
            vat_amount: 12110,
            invoice_total_amount: 200000,
            // invoice_total_amount: result.invoices.invoice[0].status[0],
            invoice_currency: 'this.currencyCode',
            invoice_amount: 100000,
            comment1: 'this.formCompanyBanking.value.comment1',
            comment2: '',
            attachment: '',
          };
          this.invoiceService.addInvoiceHeader(invoiceHeader)
            .pipe(takeUntil(this.destroyed$)).subscribe(() => {
          });

        });

        /*result.invoices.invoice.map((p) => {
        } ) */
        /* let obj = result.Employee;
         for (k in obj.emp) {
           let item = obj.emp[k];
           arr.push({
             id: item.id[0],
             name: item.name[0],
             email: item.email[0],
           });
         }*/
        resolve(arr);
      });
    });
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
