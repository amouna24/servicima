import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyPaymentTermsModel } from '@shared/models/companyPaymentTerms.model';
import { IPaymentTermsModel } from '@shared/models/paymentTerms.model';
import { IMessageCodeModel } from '@shared/models/messageCode.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyPaymentTermsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**************************************************************************
   * @description Get Tax by Company
   * @apram company company Email
   * @returns Companies Tax <list>
   *************************************************************************/
  getCompanyPaymentTerms(company: string, status?: string, offset?: number, limit?: number): Observable<ICompanyPaymentTermsModel[]> {
    return this.httpClient.get<ICompanyPaymentTermsModel[]>
    (`${environment.companyPaymentTermsApiUrl}/datatable?company_email=${company}&status=${status}&beginning=${offset}&number=${limit}` );
  }

  /**************************************************************************
   * @description Get payment terms
   * @returns payment terms <list>
   *************************************************************************/
  getPaymentTerms(): Observable<IPaymentTermsModel[]> {
    return this.httpClient.get<IPaymentTermsModel[]>(`${environment.paymentTermsApiUrl}` );
  }

  /**************************************************************************
   * @description add payment terms by Company
   * @param paymentTerms object to add
   * @returns message code
   *************************************************************************/
  addCompanyPaymentTerms(paymentTerms: object) {
    return this.httpClient
      .post(`${environment.companyPaymentTermsApiUrl}`, paymentTerms);
  }

  /**************************************************************************
   * @description update payment terms by Company
   * @apram paymentTerms object to update
   * @returns message code
   *************************************************************************/
  updateCompanyPaymentTerms(paymentTerms: object) {
    return this.httpClient
      .put(`${environment.companyPaymentTermsApiUrl}`, paymentTerms);
  }

  /**
   * @description: http request delete if wanna disable the status of the payment terms by company
   *               http request put if wanna enable the status of the payment terms
   * @param id: id payment terms
   * @param status: status
   * @param updated_by: email user
   */
  paymentTermsCompanyChangeStatus(id: string, status: string, updatedBy: string): Observable<IMessageCodeModel> {
    if (status === 'A') {
      return this.httpClient.delete<IMessageCodeModel>(`${environment.companyPaymentTermsApiUrl}/disable?_id=${id}&updated_by=${updatedBy}`);
    } else if (status === 'D') {
      return this.httpClient.put<IMessageCodeModel>(`${environment.companyPaymentTermsApiUrl}/enable?_id=${id}&updated_by=${updatedBy}`, null);
    }
  }
}
