import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IInvoiceHeaderModel } from '@shared/models/invoiceHeader.model';
import { IInvoiceLineModel } from '@shared/models/invoiceLine.model';
import { IInvoiceAttachmentModel } from '@shared/models/invoiceAttachment.model';
import { IInvoicePaymentModel } from '@shared/models/invoicePayment.model';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient, ) { }

  /**
   * @description get invoice Header
   * @param filter: filter
   */
  getInvoiceHeader(filter?): Observable<IInvoiceHeaderModel[]> {
    return this.httpClient
      .get<IInvoiceHeaderModel[]>(`${environment.invoiceHeaderApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add invoice header
   * @param invoiceHeader: new invoice header
   *************************************************************************/
  addInvoiceHeader(invoiceHeader): Observable<any> {
    return this.httpClient.post(`${environment.invoiceHeaderApiUrl}`, invoiceHeader);
  }

  /**************************************************************************
   * @description Update invoice header
   * @param invoiceHeader: new invoice header
   *************************************************************************/
  updateInvoiceHeader(invoiceHeader): Observable<any> {
    return this.httpClient.put(`${environment.invoiceHeaderApiUrl}`, invoiceHeader);
  }

  /**
   * @description get invoice line
   * @param filter: filter
   */
  getInvoiceLine(filter): Observable<IInvoiceLineModel[]> {
    return this.httpClient
      .get<IInvoiceLineModel[]>(`${environment.invoiceLineApiUrl}/${filter}`);
  }

  /**
   * @description get invoice attachment
   * @param filter: filter
   */
  getInvoiceAttachment(filter): Observable<IInvoiceAttachmentModel[]> {
    return this.httpClient
      .get<IInvoiceAttachmentModel[]>(`${environment.invoiceAttachmentApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description add many invoice Attachment
   * @param invoiceAttachment: invoiceAttachment
   *************************************************************************/
  addManyInvoiceAttachment(invoiceAttachment: object): Observable<any> {
    return this.httpClient.post(`${environment.invoiceAttachmentApiUrl}/many`, invoiceAttachment);
  }

  /**
   * @description delete many invoice attachment
   * @param InvoiceAttachment: list
   */
  deleteManyInvoiceAttachment(InvoiceAttachment: object): Observable<any> {
    return this.httpClient.put(`${environment.invoiceAttachmentApiUrl}/many`, InvoiceAttachment);
  }

  /**
   * @description delete  invoice attachment
   * @param idAttachment: idAttachment
   */
  deleteInvoiceAttachment(idAttachment: string): Observable<any> {
    return this.httpClient.delete(`${environment.invoiceAttachmentApiUrl}?_id=${idAttachment}`);
  }
  /**************************************************************************
   * @description Aad new Invoice Line
   * @param invoiceLine: invoiceLine
   *************************************************************************/
  addInvoiceLine(invoiceLine): Observable<any> {
    return this.httpClient.post(`${environment.invoiceLineApiUrl}`, invoiceLine);
  }

  /**************************************************************************
   * @description add many invoice line
   * @param invoiceLine: invoiceLine
   *************************************************************************/
  addManyInvoiceLine(invoiceLine): Observable<any> {
    return this.httpClient.post(`${environment.invoiceLineApiUrl}/many`, invoiceLine);
  }

  /**************************************************************************
   * @description Aad new Invoice attachment
   * @param invoiceAttachment: invoiceAttachment
   *************************************************************************/
  addInvoiceAttachment(invoiceAttachment): Observable<any> {
    return this.httpClient.post(`${environment.invoiceAttachmentApiUrl}`, invoiceAttachment);
  }

  /**************************************************************************
   * @description update many invoice line
   * @param invoiceLine: update invoice line
   *************************************************************************/
  updateInvoiceLine(invoiceLine): Observable<any> {
    return this.httpClient.put(`${environment.invoiceLineApiUrl}`, invoiceLine);
  }

  /**************************************************************************
   * @description update many invoice line
   * @param invoiceLine: list invoice line
   *************************************************************************/
  updateManyInvoiceLine(invoiceLine): Observable<any> {
    return this.httpClient.put(`${environment.invoiceLineApiUrl}/many`, invoiceLine);
  }

  /**
   * @description delete invoice line
   * @param id: id
   */
  deleteInvoiceLine(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.invoiceLineApiUrl}?_id=${id}`);
  }

  /**
   * @description delete many invoice line
   * @param list: list
   */
  deleteManyInvoiceLine(list: object): Observable<any> {
    return this.httpClient.put(`${environment.invoiceLineApiUrl}/many`, list);
  }

  /**
   * @description get invoice payment
   * @param filter: filter
   */
  getInvoicePayment(filter?): Observable<IInvoicePaymentModel[]> {
    return this.httpClient
      .get<IInvoicePaymentModel[]>(`${environment.invoicePaymentApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Aad new Invoice payment
   * @param invoicePayment: invoicePayment
   *************************************************************************/
  addNewInvoicePayment(invoicePayment): Observable<any> {
    return this.httpClient.post(`${environment.invoicePaymentApiUrl}`, invoicePayment);
  }

  /**************************************************************************
   * @description add many invoice payment
   * @param InvoicePayment: InvoicePayment
   *************************************************************************/
  addManyInvoicePayment(InvoicePayment): Observable<any> {
    return this.httpClient.post(`${environment.invoicePaymentApiUrl}/many`, InvoicePayment);
  }

  /**
   * @description delete many invoice payment
   * @param InvoicePayment: list
   */
  deleteManyInvoicePayment(InvoicePayment: object): Observable<any> {
    return this.httpClient.put(`${environment.invoicePaymentApiUrl}/many`, InvoicePayment);
  }

  /**************************************************************************
   * @description send invoice mail
   * @param emailAddress: email address
   * @param attachement: attachment
   * @param emailcc: email cc
   * @param emailbcc: email bcc
   * @param subject: subject
   * @param text: text
   *************************************************************************/
  sendInvoiceMail(emailAddress: string[],
                   attachement: any, emailcc, emailbcc, subject, text): Observable<any> {
    return this.httpClient.post(`${environment.invoiceHeaderApiUrl}/mailing`, {

      emailAddress, attachement, emailcc, emailbcc, subject, text });
  }

  /**
   * @description Generate invoice
   * @param data: data
   */
  generateInvoice(data): Observable<any> {

    return this.httpClient
      .post<any>(`${environment.invoiceGenerateApiUrl}/download`, data,   { responseType: 'blob' as 'json'});
  }

  /**
   * @description delete invoice
   * @param invoice: invoice
   */
  deleteInvoice(invoice): Observable<any> {
    return this.httpClient
      .post<any>(`${environment.invoiceGenerateApiUrl}/delete`, invoice, { responseType: 'blob' as 'json'});
  }

  /**
   * @description: http request get to get all invoices registered in the same company
   * @params company_email, limit, offset
   */
  getSearchInvoice(filter: string, search: string, limit?, offset?): Observable<IInvoiceHeaderModel[]> {
    return this.httpClient
      .put<IInvoiceHeaderModel[]>
      (`${environment.invoiceHeaderApiUrl}/search?beginning=${offset}&number=${limit}${filter}`, search);
  }

  /**
   * @description: http request get to get all invoice registered in the same company
   * @params company_email, limit, offset
   */
  filterAllInvoice(companyEmail: string, limit?, offset?, columns?, filterValue?,  operator?, selected ?): Observable<any> {
    return this.httpClient
      .post<IInvoiceHeaderModel[]>(
        `${environment.invoiceHeaderApiUrl}/filter?beginning=${offset}&number=${limit}&${selected}` +
            `&${columns}=${filterValue}&operator=${operator}`, selected);
  }
}
