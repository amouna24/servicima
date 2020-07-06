import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IContract } from '@shared/models/contract.model';
import { HttpClient } from '@angular/common/http';
import { IContractor } from '@shared/models/contractor.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractorsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**************************************************************************
   * @description Get Contractors List
   * @returns All Contractors <list>
   *************************************************************************/
  getContractors(filter: string): Observable<IContractor[]> {
    return this.httpClient.get<IContractor[]>(`${environment.contractorApiUrl}/${filter}` );
  }

  /**************************************************************************
   * @description Add new Contractor
   * @param Contractor Model
   *************************************************************************/
  addContractor(Contractor: IContractor): Observable<any> {
    return this.httpClient.post<IContract>(`${environment.contractorApiUrl}`, Contractor);
  }

  /**************************************************************************
   * @description Update Contractor Status
   * @param contractor updated contractor Object
   *************************************************************************/
  updateContractor(contractor: IContractor): Observable<any> {
    return this.httpClient.put<IContract>(`${environment.contractorApiUrl}`, contractor);
  }

  /**************************************************************************
   * @description Enable Contractor Status
   * @param ID of the contractor
   *************************************************************************/
  enableContractor(ID: string): Observable<any> {
    return this.httpClient.put<IContract>(`${environment.contractorApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Disable Contractor Status
   * @param ID of the contractor
   *************************************************************************/
  disableContractor(ID: string): Observable<any> {
    return this.httpClient.delete<IContract>(`${environment.contractorApiUrl}/disable?_id=${ID}`);
  }
}
