import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient, ) { }

  /**
   * @description get invoice Header
   * @param filter: filter
   */
  getInvoiceHeader(filter?): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.invoiceHeaderApiUrl}/${filter}`);
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
  getInvoiceLine(filter): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.invoiceLineApiUrl}/${filter}`);
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
  getInvoicePayment(filter?): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.invoicePaymentApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description send invoice mail
   * @param languageId: language id
   * @param applicationId: application od
   * @param companyId: company id
   * @param emailAddress: email address
   * @param companyName: company name
   * @param collaboratorPosition: collaborator position
   * @param resumeUrl: resume url
   * @param attachment: attachment
   *************************************************************************/
  sendInvoiceMail(languageId: string, applicationId: string, companyId: string, emailAddress: string,
                  companyName: string, collaboratorPosition: string, resumeUrl: string, attachment: any): Observable<any> {
    return this.httpClient.post(`${environment.invoiceHeaderApiUrl}/mailing`, { languageId,
      applicationId,
      companyId,
      emailAddress,
      companyName,
      collaboratorPosition,
      resumeUrl, attachment });
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
}
