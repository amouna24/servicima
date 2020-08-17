import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IContract } from '@shared/models/contract.model';
import { HttpClient } from '@angular/common/http';
import { IContractor } from '@shared/models/contractor.model';
import { IContractorContact } from '@shared/models/contractorContact.model';

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
   * @description Get contractorContact List
   * @returns All contractorContact <list>
   *************************************************************************/
  getContractorsContact(filter: string): Observable<IContractorContact[]> {
    return this.httpClient.get<IContractorContact[]>(`${environment.contractorContactApiUrl}/${filter}` );
  }
  /**************************************************************************
   * @description Add new Contractor
   * @param Contractor Model
   *************************************************************************/
  addContractor(Contractor: IContractor): Observable<any> {
    return this.httpClient.post<IContract>(`${environment.contractorApiUrl}`, Contractor);
  }

  /**************************************************************************
   * @description Add new contractorContact
   * @param contractorContact Model
   *************************************************************************/
  addContractorContact(contractorContact: IContractorContact): Observable<any> {
    return this.httpClient.post<IContractorContact>(`${environment.contractorContactApiUrl}`, contractorContact);
  }

  /**************************************************************************
   * @description Update Contractor Status
   * @param contractor updated contractor Object
   *************************************************************************/
  updateContractor(contractor: IContractor): Observable<any> {
    return this.httpClient.put<IContract>(`${environment.contractorApiUrl}`, contractor);
  }

  /**************************************************************************
   * @description Update contractorContact Status
   * @param contractorContact updated contractorContact Object
   *************************************************************************/
  updateContractorContact(contractorContact: IContractorContact): Observable<any> {
    return this.httpClient.put<IContractorContact>(`${environment.contractorContactApiUrl}`, contractorContact);
  }

  /**************************************************************************
   * @description Enable Contractor Status
   * @param ID of the contractor
   *************************************************************************/
  enableContractor(ID: string): Observable<any> {
    return this.httpClient.put<IContract>(`${environment.contractorApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Enable contractorContact Status
   * @param ID of the contractor
   *************************************************************************/
  enableContractorContact(ID: string): Observable<any> {
    return this.httpClient.put<IContractorContact>(`${environment.contractorContactApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Disable Contractor Status
   * @param ID of the contractor
   *************************************************************************/
  disableContractor(ID: string): Observable<any> {
    return this.httpClient.delete<IContract>(`${environment.contractorApiUrl}/disable?_id=${ID}`);
  }

  /**************************************************************************
   * @description Disable IContractorContact Status
   * @param ID of the IContractorContact
   *************************************************************************/
  disableContractorContact(ID: string): Observable<any> {
    return this.httpClient.delete<IContractorContact>(`${environment.contractorContactApiUrl}/disable?_id=${ID}`);
  }
}
