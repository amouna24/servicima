import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContract } from '@shared/models/contract.model';
import { Observable } from 'rxjs';
import { IContractExtension } from '@shared/models/contractExtension.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(
    private httpClient: HttpClient,
  ) { }
  /*------------------------------------ CONTRACT --------------------------------------*/

  /**************************************************************************
   * @description Get Contract List
   * @param filter search query like [ ?id=123 ]
   * @returns All Contracts Observable<IContract[]>
   *************************************************************************/
  getContracts(filter: string): Observable<IContract[]> {
    return this.httpClient.get<IContract[]>(`${environment.contractApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Contract
   * @param Contract: Contract Model
   *************************************************************************/
  addContract(Contract: IContract): Observable<any> {
    return this.httpClient.post<IContract>(`${environment.contractApiUrl}`, Contract);
  }

  /**************************************************************************
   * @description Update Contractor Status
   * @param contract: updated contract Object
   *************************************************************************/
  updateContract(contract: IContract): Observable<any> {
    return this.httpClient.put<IContract>(`${environment.contractApiUrl}`, contract);
  }

  /**************************************************************************
   * @description Enable Contract Status
   * @param ID of the contract
   *************************************************************************/
  enableContract(ID: string): Observable<any> {
    return this.httpClient.put<IContract>(`${environment.contractApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Disable Contract Status
   * @param ID : of the contract
   *************************************************************************/
  disableContract(ID: string): Observable<any> {
    return this.httpClient.delete<IContract>(`${environment.contractApiUrl}/disable?_id=${ID}`);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------CONTRACT EXTENSIONS -----------------------------------*/

  /**************************************************************************
   * @description Get Contract Extensions List
   * @param filter: search query like [ ?id=123 ]
   * @returns All ContractExtensions Observable<IContractExtension[]>
   *************************************************************************/
  getContractExtension(filter: string): Observable<IContractExtension[]> {
    return this.httpClient.get<IContractExtension[]>(`${environment.contractExtensionApiUrl}/${filter}` );
  }

  /**************************************************************************
   * @description Add new ContractExtension
   * @param contractExtension Model
   *************************************************************************/
  addContractExtension(contractExtension: IContractExtension): Observable<any> {
    return this.httpClient.post<IContractExtension>(`${environment.contractExtensionApiUrl}`, contractExtension);
  }

  /**************************************************************************
   * @description Update ContractExtension
   * @param contractExtension: updated contractExtension Object
   *************************************************************************/
  updateContractExtension(contractExtension: IContractExtension): Observable<any> {
    return this.httpClient.put<IContractExtension>(`${environment.contractExtensionApiUrl}`, contractExtension);
  }

  /**************************************************************************
   * @description Enable ContractExtension Status
   * @param ID : of the contractExtension
   *************************************************************************/
  enableContractExtension(ID: string): Observable<any> {
    return this.httpClient.put<IContractExtension>(`${environment.contractExtensionApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Disable ContractExtension Status
   * @param ID : of contractExtension
   *************************************************************************/
  disableContractExtension(ID: string): Observable<any> {
    return this.httpClient.delete<IContractExtension>(`${environment.contractExtensionApiUrl}/disable?_id=${ID}`);
  }

  /*------------------------------------------------------------------------*/
}
