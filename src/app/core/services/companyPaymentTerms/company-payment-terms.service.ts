import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyPaymentTermsModel } from '@shared/models/companyPaymentTerms.model';
import { IPaymentTermsModel } from '@shared/models/paymentTerms.model';

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
  getCompanyPaymentTerms(company: string): Observable<ICompanyPaymentTermsModel[]> {
    return this.httpClient.get<ICompanyPaymentTermsModel[]>(`${environment.companyPaymentTermsApiUrl}/?company_email=${company}` );
  }

  /**************************************************************************
   * @description Get payment terms
   * @returns payment terms <list>
   *************************************************************************/
  getPaymentTerms(): Observable<IPaymentTermsModel[]> {
    return this.httpClient.get<IPaymentTermsModel[]>(`${environment.paymentTermsApiUrl}` );
  }
}
