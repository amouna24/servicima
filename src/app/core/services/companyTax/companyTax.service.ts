import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyTaxModel } from '@shared/models/companyTax.model';

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
  getCompanyTax(company: string): Observable<ICompanyTaxModel[]> {
    return this.httpClient.get<ICompanyTaxModel[]>(`${environment.companyTaxApiUrl}/?company_email=${company}` );
  }

}
