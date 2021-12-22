import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import xml2js from 'xml2js';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { Router } from '@angular/router';
import { IContractor } from '@shared/models/contractor.model';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MailingModalComponent } from '@shared/components/mailing-modal/mailing-modal.component';
import { saveAs } from 'file-saver';
import { IInvoiceHeaderModel } from '@shared/models/invoiceHeader.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { SheetService } from '@core/services/sheet/sheet.service';
import { environment } from '@environment/environment';
import { map, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { UploadService } from '@core/services/upload/upload.service';

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
  listContractor: IContractor[];
  companyEmail: string;
  finalMapping = new BehaviorSubject<any>([]);
  allowedActions = [];
  applicationId: string;
  languageId: string;
  userInfo: IUserInfo;
  public xmlItems: string[];
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
              private datePipe: DatePipe,
              private uploadService: UploadService,
              private utilsService: UtilsService,
              private sheetService: SheetService,
              private translate: TranslateService,
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
      console.log(data, 'data');
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
            const reader = new FileReader();
            reader.onload = () => {
              this.parseXML(reader.result)
                .then((xml) => {
                  this.xmlItems = xml;

                });
            };
            reader.readAsText(res.selectedFile);
          }
        });
  }

  /**
   * @description parse xml
   */
  parseXML(data): Promise<string[]> {
    let i = 0;
    const companyEmail = this.companyEmail;
    const listContractor = this.listContractor;
    return new Promise(resolve => {
      const  arr = [];
      let listInvoiceLine = [];
      const  parser = new xml2js.Parser({
        trim: true,
        explicitArray: true
      });
      parser.parseString(data, (err, result) => {
        result.invoices.invoice.map((resp) => {
          this.invoiceService.getInvoiceHeader(`?email_address=${this.companyEmail}&invoice_nbr=${resp.no}`).subscribe((response) => {
            console.log(response, 'responese');
            // @ts-ignore
            if (response?.results.length) {
             alert(`Invoice N°${resp.no} already exist`);
            } else {
              listInvoiceLine = [];
              const contractorCode =  listContractor.find(value => value.contractor_name  === 'Adele Willis').contractorKey.contractor_code;
              resp.items.map((item) => {
                item.item.map((ip) => {
                  const TotalTax = parseInt(ip.taxes[0].tax_1[0], 10) + parseInt(ip.taxes[0].tax_2[0], 10);
                  const invoiceLine = { /* Unique Key */
                    InvoiceLineKey :
                      {
                        application_id : this.languageId,
                        company_email : companyEmail,
                        invoice_nbr : parseInt(resp.no[0], 10),
                        invoice_line_code : 'invoiceLine' + Math.random()
                      },
                    project_code : 'project0001',
                    project_desc : ip.description[0],
                    invoice_line_unit_amount : parseInt(ip.unit_cost[0], 10),
                    days_nbr : ip.quantity[0],
                    vat_rate : (TotalTax * 100) / (parseInt(ip.unit_cost[0], 10) *  ip.quantity[0] ),
                    vat_amount : TotalTax,
                    discount : ip.discount[0] ? ip.discount[0] : 0,
                    invoice_line_total_amount: parseInt(ip.unit_cost[0], 10) *  ip.quantity[0],
                    comment1 : resp.remark[0],
                    comment2 : 'comment2',
                  };
                  listInvoiceLine.push(invoiceLine);
                });
                this.invoiceService.addManyInvoiceLine(listInvoiceLine).subscribe((invoiceLineAdded) => {
                  console.log(invoiceLineAdded);
                });
              });

              const invoiceHeader = {
                application_id: this.applicationId,
                company_email: companyEmail,
                invoice_nbr: parseInt(resp.no[0], 10),
                invoice_status: resp.status[0],
                factor_involved: 'N',
                invoice_date: this.datePipe.transform(new Date()),
                invoice_delay: this.datePipe.transform(new Date()),
                contractor_code: contractorCode,
                contract_code: 'AZE21T8',
                vat_amount: parseInt(resp.taxes[0].tax_1[0].value[0], 10) + parseInt(resp.taxes[0].tax_2[0].value[0], 10),
                invoice_amount: parseInt(resp.total[0], 10),
                invoice_total_amount: parseInt(resp.total[0], 10)
                  + parseInt(resp.taxes[0].tax_1[0].value[0], 10) + parseInt(resp.taxes[0].tax_2[0].value[0], 10) ,
                invoice_currency: 'USD',
                comment1: resp.remark[0],
                comment2: '',
                attachment: '',
              };
              i = i ++;

              const label: object = this.getLabel();
              const listLineInvoice = listInvoiceLine.map((invoice) => {
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
                invoiceNbr: resp.no[0],
                name: this.userInfo['company_name'],
                address: this.userInfo['adress'],
                email: this.userInfo['contact_email'],
                phone: this.userInfo['phone_nbr1'],
                siteWeb: this.userInfo['web_site'],
                date: this.datePipe.transform(invoiceHeader.invoice_date),
                invoiceDelay: this.datePipe.transform(invoiceHeader.invoice_delay),
                imageUrl: environment.uploadFileApiUrl + '/image/' + this.userInfo['photo'],
                detailsBanking: {
                  companyBanking: invoiceHeader.comment1,
                  isFactor: false
                }
              };
              const contractorName =  listContractor.find(value => value.contractorKey.contractor_code  === contractorCode).contractor_name;
              const contractorAddress =  listContractor.find(value => value.contractorKey.contractor_code  === contractorCode).address;

              const contractor = {
                contractorName,
                contractorAddress,
              };

              const total = {
                sousTotalHT: invoiceHeader.invoice_amount,
                vatMount: invoiceHeader.vat_amount,
                totalTTC: invoiceHeader.invoice_total_amount,
              };
              const listParmaToPassToPDF = { company, listLineInvoice, contractor, total, label, upload: true };
              this.generateInvoicePdf(listParmaToPassToPDF, invoiceHeader, result.invoices.invoice.length, i ++);
            }
          });

        });
        resolve(arr);
      });
    });
  }

  /**************************************************************************
   * @description generate pdf
   * @param listParamToPassToPDF: list param to pass in pdf
   * @param invoiceHeader: invoice header
   * @param count: count
   * @param i: index
   *************************************************************************/
  generateInvoicePdf(listParamToPassToPDF: object, invoiceHeader: object, count: number , i: number): void {
    this.invoiceService.generateInvoice(listParamToPassToPDF)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async (res) => {
          const file = new File([res], `invoice${listParamToPassToPDF['company']['invoiceNbr']}.pdf`,
            { lastModified: new Date().getTime(), type: res.type });
          const formData = new FormData();
          formData.append('file', file);
          formData.append('caption', file.name);
          const fileName = await this.uploadFile(formData);
          invoiceHeader['attachment'] = fileName;
        this.invoiceService.addInvoiceHeader(invoiceHeader).subscribe((response) => {
          if (response) {
            if (i === count - 1) {
              this.getAllInvoices(this.nbtItems.getValue(), 0);
            }
          }
        });
          const path = { path: file.name };
          this.invoiceService.deleteInvoice(path)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
            }, (error => {
              console.error(error);
            }));
        }
      );
  }

  /**************************************************************************
   * @description Upload Image to Server
   * @param formData: formData
   *************************************************************************/
  async uploadFile(formData: FormData): Promise<string> {
    return await this.uploadService.uploadImageLocal(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
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

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
