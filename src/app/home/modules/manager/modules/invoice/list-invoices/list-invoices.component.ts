import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { Router } from '@angular/router';
import { IContractor } from '@shared/models/contractor.model';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { MailingModalComponent } from '@shared/components/mailing-modal/mailing-modal.component';
import { saveAs } from 'file-saver';
import { IInvoiceHeaderModel } from '@shared/models/invoiceHeader.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { SheetService } from '@core/services/sheet/sheet.service';
import { environment } from '@environment/environment';
import { takeUntil } from 'rxjs/operators';

import { ChangePwdInvoiceComponent } from '../change-pwd-invoice/change-pwd-invoice.component';
import { SetPwdInvoiceComponent } from '../set-pwd-invoice/set-pwd-invoice.component';
import { PaymentInvoiceComponent } from '../payment-invoice/payment-invoice.component';
import { ListImportInvoiceComponent } from '../list-import-invoice/list-import-invoice.component';

@Component({
  selector: 'wid-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})
export class ListInvoicesComponent implements OnInit, OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<IInvoiceHeaderModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  listContractor: IContractor[];
  companyEmail: string;
  finalMapping = new BehaviorSubject<any>([]);
  allowedActions = [];
  applicationId: string;
  languageId: string;
  userInfo: IUserInfo;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  subscriptionModal: Subscription;
  searchParam: any;
  searchInvoices: any;
  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);

  constructor(private userService: UserService,
              private modalService: ModalService,
              private invoiceService: InvoiceService,
              private contractorsService: ContractorsService,
              private router: Router,
              private sheetService: SheetService,
              private localStorageService: LocalStorageService,
              ) { }
  /**
   * @description Loaded when component in init state
   */
  async ngOnInit(): Promise<void> {
    this.isLoading.next(true);
    this.modalService.registerModals(
      { modalName: 'protectInvoice', modalComponent: ChangePwdInvoiceComponent });
    this.modalService.registerModals(
      { modalName: 'setPwdInvoice', modalComponent: SetPwdInvoiceComponent });
    this.modalService.registerModals({ modalName: 'importInvoice', modalComponent: ListImportInvoiceComponent });

    this.modalService.registerModals({ modalName: 'mailing', modalComponent: MailingModalComponent });
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.languageId = this.localStorageService.getItem('language').langId;
    this.getConnectedUser();
    await this.getContractor();
    this.modalService.registerModals(
      { modalName: 'PayInvoice', modalComponent: PaymentInvoiceComponent });
    this.getAllInvoices(this.nbtItems.getValue(), 0);
    this.sheetService.registerSheets(
      [
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent},
      ]);
  }

  /**
   * @description Get connected user
   */
  getConnectedUser(): void {
    this.userService.connectedUser$.pipe(takeUntil(this.destroyed$))
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.userInfo = userInfo['company'][0];
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

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    if (params.searchBoolean) {
      this.invoiceService.getSearchInvoice(this.companyEmail, this.searchInvoices, params.limit, params.offset).subscribe((data) => {
        this.mapResult(data);
        this.ELEMENT_DATA.next(data);
        this.isLoading.next(false);
      });

    } else if (params.search) {
     this.mapData();
      this.invoiceService.filterAllInvoice(this.companyEmail, params.limit, params.offset,
        this.searchParam.columns, this.searchParam.filterValue, this.searchParam.operator)
        .subscribe((res) => {
          this.mapResult(res);
          this.ELEMENT_DATA.next(res);
        });
    } else {
      this.nbtItems.next(params.limit);
       this.getAllInvoices(params.limit, params.offset);
    }

  }

  /**************************************************************************
   * @description map data
   *************************************************************************/
  mapData() {
    if (this.searchParam.columns === 'contractor_code' && this.searchParam.operator === 'is' ) {
      this.searchParam.filterValue = this.listContractor.find((contractor) => contractor.contractor_name === this.searchParam.filterValue) ?
        this.listContractor.find((contractor) => contractor.contractor_name
          === this.searchParam.filterValue).contractorKey.contractor_code : this.searchParam.filterValue;
    } else if (this.searchParam.columns === 'contractor_code' && this.searchParam.operator === 'includes')  {
      this.searchParam.filterValue = this.listContractor.find((contractor) =>  contractor.contractor_name.toLowerCase()
        .includes( this.searchParam.filterValue.toLowerCase())) ?
        this.listContractor.find((contractor) => contractor.contractor_name.toLowerCase()
          .includes(this.searchParam.filterValue.toLowerCase())).contractorKey.contractor_code : this.searchParam.filterValue;
    }
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param filter object
   *************************************************************************/
  search(filter) {
    this.searchParam = filter;
    this.mapData();
    this.invoiceService.filterAllInvoice(this.companyEmail, this.nbtItems.getValue(), 0, filter.columns, filter.filterValue, filter.operator)
      .subscribe((res) => {
        this.mapResult(res);
        this.ELEMENT_DATA.next(res);
      });
  }

  /**************************************************************************
   * @description map result
   * @param res res
   *************************************************************************/
  mapResult(res) {
    if (res['results'].length > 0) {
      res['results'].map((s) => {
        s['code'] = s['contractor_code'];
        s['contractor_code'] = this.listContractor
          .find(value => value.contractorKey.contractor_code === s['contractor_code']).contractor_name;
      });
    }
  }

  /**************************************************************************
   * @description search invoice
   * @param params params
   *************************************************************************/
  searchInvoice(params) {
    this.searchInvoices = params;
   const valueSearch =  this.listContractor
     .find((contractor) => contractor.contractor_name.trim().toLowerCase() ===   params.value.value1.trim().toLowerCase()) ?
      this.listContractor
        .find((contractor) => contractor.contractor_name.trim().toLowerCase()
        ===   params.value.value1.trim().toLowerCase()).contractorKey.contractor_code : '';
      valueSearch ?  params.value.value2 =   { 'column': 'contractor_code', value: valueSearch } :
        params.value.value2 =   { 'column': '', value: '' };
    this.invoiceService.getSearchInvoice(this.companyEmail, params, this.nbtItems.getValue(), 0).subscribe((data) => {
      this.mapResult(data);
      this.ELEMENT_DATA.next(data);
    });
  }

  /**
   * @description get all invoices by company
   */
  getAllInvoices(limit: number, offset: number): void {
    this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmail}&beginning=${offset}&number=${limit}`)
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
          this.ELEMENT_DATA.next(data);
          this.isLoading.next(false);
        }
      }, error => console.error(error)
    );
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: { actionType: string, data: IInvoiceHeaderModel[]}): void {
    switch (rowAction.actionType) {
      case ('show'): this.showInvoice(rowAction.data);
        break;
      case ('update'): this.updateInvoice(rowAction.data as any);
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
  updateInvoice(data: IInvoiceHeaderModel): void {
      this.router.navigate(['/manager/invoices/add-invoice'],
        { state: { nbrInvoice: data.InvoiceHeaderKey.invoice_nbr }
        });
  }

  /**
   * @description : show invoice
   * @param data: invoice to show
   */
  showInvoice(data: IInvoiceHeaderModel[]): void {
    data.map((invoice) => {
      const fileURL = `${environment.uploadFileApiUrl}/show/` + invoice['attachment'] ;
   // const fileURL = `${environment.uploadFileApiLocalUrl}/show/` + invoice['attachment'] ;

      window.open(fileURL);
    });
  }

  /**
   * @description : download invoice
   * @param data: invoice to show
   */
  downloadInvoice(data: IInvoiceHeaderModel[]): void {
    data.map((invoice) => {
      const fileURL = `${environment.uploadFileApiUrl}/show/` + invoice['attachment'];
    //  const fileURL = `${environment.uploadFileApiLocalUrl}/show/` + invoice['attachment'];
      saveAs(fileURL, 'invoice' + invoice['InvoiceHeaderKey']['invoice_nbr'] + '.pdf');
    });

  }

  /**
   * @description : send mailing
   * @param row: list invoices to send
   */
  sendMailing(row: IInvoiceHeaderModel[]): void {
    this.subscriptionModal = this.modalService.displayModal('mailing', row, '500px', '640px')
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
  archiver(data: IInvoiceHeaderModel[]): void {
    data.map((invoice) => {
      const invoiceHeader = {
        application_id: invoice.InvoiceHeaderKey.application_id,
        company_email: invoice.InvoiceHeaderKey.company_email,
        invoice_nbr: invoice.InvoiceHeaderKey.invoice_nbr ,
        invoice_status: 'Rejected',
        factor_involved: invoice.factor_involved,
        invoice_date: invoice.invoice_date,
        invoice_delay: invoice.invoice_delay,
        contractor_code: invoice['code'] ,
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
    this.getAllInvoices(this.nbtItems.getValue(), 0);
  }

  /**
   * @description load xml
   */
  loadXML(): void {

 this.sheetService.displaySheet('uploadSheetComponent', { acceptedFormat: '.xml'})
      .pipe(takeUntil(this.destroyed$)).subscribe(
        async (res) => {
          if (res) {
            this.displayImportModal(res);
          }
        });
  }

  displayImportModal(data: any): void {
    this.modalService.displayModal(
      'importInvoice',
      {
        files: data,
        application_id: this.userService.applicationId,
        company_email: this.companyEmail,
        listContractor: this.listContractor,
        userInfo: this.userInfo
      },
      '62vw',
      '80vh').subscribe(
      async (res) => {
        console.log(res, 'res');
       if (res) {
         this.getAllInvoices(this.nbtItems.getValue(), 0);
       }
      }
    );
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
