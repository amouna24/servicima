import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContractProjectService {

  constructor(private httpClient: HttpClient, ) { }

  /**************************************************************************
   * @description Get banking information by Company
   * @param company company Email
   * @returns: banking information
   *************************************************************************/
  getContractProject(company: string, contractCode: string): Observable<any> {
    return this.httpClient.get(`${environment.contractProjectApiUrl}/?company_email=${company}&contract_code=${contractCode}` );
  }
}
