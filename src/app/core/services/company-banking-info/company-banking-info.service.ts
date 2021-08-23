import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICompanyBankingInfoModel } from '@shared/models/companyBankingInfo.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyBankingInfoService {

  constructor(private httpClient: HttpClient, ) { }
   /**************************************************************************
   * @description Get banking information by Company
   * @apram company company Email
   * @returns: banking information
   *************************************************************************/
    getCompanyBankingInfo(company: string): Observable<ICompanyBankingInfoModel[]> {
      return this.httpClient.get<ICompanyBankingInfoModel[]>(`${environment.companyBankingInfoApiUrl}/?email_address=${company}` );
    }

    /**************************************************************************
     * @description add new banking information by Company
     * @apram object to add new banking information
     * @returns: new banking information
     *************************************************************************/
    addCompanyBankingInfo(object: object): Observable<any> {
      return this.httpClient.post(`${environment.companyBankingInfoApiUrl}`, object );
    }

    /**************************************************************************
     * @description add new banking information by Company
     * @apram object to add new banking information
     * @returns: new banking information
     *************************************************************************/
    updateCompanyBankingInfo(object: object): Observable<any> {
      return this.httpClient.put(`${environment.companyBankingInfoApiUrl}`, object );
    }
}
