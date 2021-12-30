import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyTaxModel } from '@shared/models/companyTax.model';
import { ITaxModel } from '@shared/models/tax.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyTaxService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**************************************************************************
   * @description Get Tax by Company
   * @apram company company Email
   * @returns Companies Tax <list>
   *************************************************************************/
  getCompanyTax(company: string, limit?: number, offset?: number): Observable<ICompanyTaxModel[]> {
    return this.httpClient.get<ICompanyTaxModel[]>
    (`${environment.companyTaxApiUrl}/datatable?company_email=${company}&beginning=${offset}&number=${limit}` );
  }

  /**************************************************************************
   * @description Get Tax
   * @returns Tax <list>
   *************************************************************************/
  getTax(): Observable<ITaxModel[]> {
    return this.httpClient.get<ITaxModel[]>(`${environment.taxApiUrl}` );
  }

  /**************************************************************************
   * @description add tax by company
   * @param companyTax object to add
   * @returns message code
   *************************************************************************/
  addCompanyTax(companyTax) {
    return this.httpClient
      .post(`${environment.companyTaxApiUrl}`, companyTax);
  }

  /**************************************************************************
   * @description update tax by company
   * @param companyTax object to update
   * @returns message code
   *************************************************************************/
  updateCompanyTax(companyTax) {
    return this.httpClient
      .put(`${environment.companyTaxApiUrl}`, companyTax);
  }

}
