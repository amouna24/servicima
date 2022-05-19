import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '@environment/environment';
import xml2js from 'xml2js';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { DatePipe } from '@angular/common';
import { map, takeUntil } from 'rxjs/operators';
import { UploadService } from '@core/services/upload/upload.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wid-list-import-invoice',
  templateUrl: './list-import-invoice.component.html',
  styleUrls: ['./list-import-invoice.component.scss']
})
export class ListImportInvoiceComponent implements OnInit {
  selectedFiles = new BehaviorSubject<any[]>([]);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public xmlItems: string[];

  constructor(public dialogRef: MatDialogRef<ListImportInvoiceComponent>,
              @Inject(MAT_DIALOG_DATA) private data: { files: any[], application_id: string, company_email: string },
              private invoiceService: InvoiceService,
              private uploadService: UploadService,
              private datePipe: DatePipe,
              private translate: TranslateService) {
  }

  async ngOnInit() {
    const reader = new FileReader();
    reader.onload = async () => {
      await this.parseXML(reader.result)
        .then((xml) => {
          this.xmlItems = xml;
          this.selectedFiles.next(this.xmlItems);
        });
    };
    reader.readAsText(this.data.files['selectedFile']);
  }

  async parseXML(data): Promise<string[]> {
    return new Promise(resolve => {
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: true
      });
      parser.parseString(data, (err, result) => {
        resolve(result.invoices.invoice);
      });
    });
  }

  /**************************************************************************
   * @description get label
   * @return list label to pass in pdf
   *************************************************************************/
  getLabel(): object {
    let label: object;
    const translateKey = ['invoice.website', 'invoice.email', 'invoice.phone', 'invoice.balance.payable',
      'invoice.total', 'invoice.subtotal', 'invoice.bic.code', 'invoice.rib', 'invoice.iban', 'invoice.address',
      'invoice.condition.and.modality', 'invoice.project.amount', 'invoice.project.vat', 'invoice.project.quantity',
      'invoice.project.price', 'invoice.project.description', 'invoice.invoice.to', 'invoice.due.date',
      'invoice.date', 'invoice.n°', 'invoice.sender', 'invoice.title'];
    this.translate.get(translateKey)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        label = {
          title: res['invoice.title'],
          of: res['invoice.sender'],
          number: res['invoice.n°'],
          dateStart: res['invoice.date'],
          dateDeadLine: res['invoice.due.date'],
          invoiceTo: res['invoice.invoice.to'],
          description: res['invoice.project.description'],
          price: res['invoice.project.price'],
          quantity: res['invoice.project.quantity'],
          vat: res['invoice.project.vat'],
          amount: res['invoice.amountLine'],
          ConditionAndModality: res['invoice.condition.and.modality'],
          address: res['invoice.address'],
          IBAN: res['invoice.iban'],
          RIB: res['invoice.rib'],
          BicCode: res['invoice.bic.code'],
          Subtotal: res['invoice.subtotal'],
          TotalTTC: res['invoice.total'],
          accountsPayable: res['invoice.balance.payable'],
          phone: res['invoice.phone'],
          Email: res['invoice.email'],
          SiteWeb: res['invoice.website'],
        };
      }, (error => {
        console.error(error);
      }));
    return label;
  }

  /**************************************************************************
   * @description generate pdf
   * @param listParamToPassToPDF: list param to pass in pdf
   * @param invoiceHeader: invoice header
   *************************************************************************/
  generateInvoicePdf(listParamToPassToPDF: object, invoiceHeader: object): void {
    this.invoiceService.generateInvoice(listParamToPassToPDF)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async (res) => {
          const file = new File([res], `invoice${listParamToPassToPDF['company']['invoiceNbr']}.pdf`,
            { lastModified: new Date().getTime(), type: res.type });
          const formData = new FormData();
          formData.append('file', file);
          formData.append('caption', file.name);
        invoiceHeader['attachment'] = await this.uploadFile(formData);
          this.invoiceService.addInvoiceHeader(invoiceHeader).subscribe((response) => {
            if (response) {
              console.log(response);
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
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }

  modalActions(action?: string) {
    if (action) {
      this.dialogRef.close(action);
    } else {
      this.dialogRef.close();
    }
  }

  /*loaded() {
    return (this.selectedFiles.value.length === 9) ;
   // return (this.selectedFiles.value.length === this.totalFiles) ;
  }*/

  associate(file: any) {
    this.invoiceService.getInvoiceHeader(`?email_address=${this.data.company_email}&invoice_nbr=${file.no}`).subscribe((response) => {
      // @ts-ignore
      if (response?.results.length) {
        // alert(`Invoice N°${resp.no} already exist`);
        console.log(`Invoice N°${file.no} already exist`);
        this.selectedFiles.getValue().find((fil) =>  file.no === fil.no).btnColor = 'red';
        this.selectedFiles.getValue().find((fil) =>  file.no === fil.no).btnLabel = 'already exist';
        this.selectedFiles.next(this.selectedFiles.getValue());
      } else {
        const companyEmail = this.data.company_email;
        const listContractor = this.data['listContractor'];

        const listInvoiceLine = [];
        // const contractorCode = listContractor.find(value => value.contractor_name === 'Luke Harmon').contractorKey.contractor_code;
        const contractorCode = listContractor[0].contractorKey.contractor_code;
        file.items.map((item) => {
          item.item.map((ip) => {
            const TotalTax = parseInt(ip.taxes[0].tax_1[0], 10) + parseInt(ip.taxes[0].tax_2[0], 10);
            const invoiceLine = {
              /* Unique Key */

              InvoiceLineKey:
                {
                  application_id: this.data.application_id,
                  company_email: companyEmail,
                  invoice_nbr: parseInt(file.no[0], 10),
                  invoice_line_code: 'invoiceLine' + Math.random()
                },
              project_code: 'project0001',
              project_desc: ip.description[0],
              invoice_line_unit_amount: parseInt(ip.unit_cost[0], 10),
              days_nbr: ip.quantity[0],
              vat_rate: (TotalTax * 100) / (parseInt(ip.unit_cost[0], 10) * ip.quantity[0]),
              vat_amount: TotalTax,
              discount: ip.discount[0] ? ip.discount[0] : 0,
              invoice_line_total_amount: parseInt(ip.unit_cost[0], 10) * ip.quantity[0],
              comment1: file.remark[0],
              comment2: 'comment2',
            };
            listInvoiceLine.push(invoiceLine);
          });
          this.invoiceService.addManyInvoiceLine(listInvoiceLine).subscribe((invoiceLineAdded) => {
            console.log(invoiceLineAdded);
          });
        });

        const invoiceHeader = {
          application_id: this.data.application_id,
          company_email: companyEmail,
          invoice_nbr: parseInt(file.no[0], 10),
          invoice_status: file.status[0],
          factor_involved: 'N',
          invoice_date: this.datePipe.transform(new Date()),
          invoice_delay: this.datePipe.transform(new Date()),
          contractor_code: contractorCode,
          contract_code: 'AZE21T8',
          vat_amount: parseInt(file.taxes[0].tax_1[0].value[0], 10) + parseInt(file.taxes[0].tax_2[0].value[0], 10),
          invoice_amount: parseInt(file.total[0], 10),
          invoice_total_amount: parseInt(file.total[0], 10)
            + parseInt(file.taxes[0].tax_1[0].value[0], 10) + parseInt(file.taxes[0].tax_2[0].value[0], 10),
          invoice_currency: 'USD',
          comment1: file.remark[0],
          comment2: '',
          attachment: '',
        };

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
          invoiceNbr: file.no[0],
          name: this.data['userInfo']['company_name'],
          address: this.data['userInfo']['adress'],
          email: this.data['userInfo']['contact_email'],
          phone: this.data['userInfo']['phone_nbr1'],
          siteWeb: this.data['userInfo']['web_site'],
          date: this.datePipe.transform(invoiceHeader.invoice_date),
          invoiceDelay: this.datePipe.transform(invoiceHeader.invoice_delay),
          imageUrl: environment.uploadFileApiUrl + '/image/' + this.data['userInfo']['photo'],
          detailsBanking: {
            companyBanking: invoiceHeader.comment1,
            isFactor: false
          }
        };
        const contractorName = listContractor.find(value => value.contractorKey.contractor_code === contractorCode).contractor_name;
        const contractorAddress = listContractor.find(value => value.contractorKey.contractor_code === contractorCode).address;

        const contractor = {
          contractorName,
          contractorAddress,
        };

        const total = {
          sousTotalHT: invoiceHeader.invoice_amount,
          vatMount: invoiceHeader.vat_amount,
          totalTTC: invoiceHeader.invoice_total_amount,
        };
        const listParmaToPassToPDF = { company, listLineInvoice, contractor, total, label, upload: true};
        this.generateInvoicePdf(listParmaToPassToPDF, invoiceHeader);
        this.selectedFiles.getValue().find((fil) =>  file.no === fil.no).btnLabel = 'Done';
        this.selectedFiles.getValue().find((fil) =>  file.no === fil.no).btnColor = 'green';
        this.selectedFiles.next(this.selectedFiles.getValue());
      }
    });
  }
}
