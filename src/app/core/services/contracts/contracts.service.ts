import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContract } from '@shared/models/contract.model';
import { Observable } from 'rxjs';
import { IContractExtension } from '@shared/models/contractExtension.model';
import { IContractProject } from '@shared/models/contractProject.model';

import { environment } from '../../../../environments/environment';
// tslint:disable-next-line:origin-ordered-imports
import { IProjectCollaborator } from '@shared/models/projectCollaborator.model';

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
  getContracts(filter: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.contractApiUrl}${filter}`);
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

  /**************************************************************************
   * @description Disable ContractExtension Status
   * @param ID : of contractExtension
   *************************************************************************/
  deleteContractExtension(ID: string): Observable<any> {
    return this.httpClient.delete<IContractExtension>(`${environment.contractExtensionApiUrl}?_id=${ID}`);
  }

  /*------------------------------------------------------------------------*/

  /*------------------------------CONTRACT PROJECT -----------------------------------*/

  /**************************************************************************
   * @description Get Contract Project List
   * @param filter: search query like [ ?id=123 ]
   * @returns All ContractProject Observable<IContractProject[]>
   *************************************************************************/
  getContractProject(filter: string): Observable<IContractProject[]> {
    return this.httpClient.get<IContractProject[]>(`${environment.contractProjectApiUrl}${filter}` );
  }

  /**************************************************************************
   * @description Add new ContractProject
   * @param contractProject Model
   *************************************************************************/
  addContractProject(contractProject: IContractProject): Observable<any> {
    return this.httpClient.post<IContractProject>(`${environment.contractProjectApiUrl}`, contractProject);
  }

  /**************************************************************************
   * @description Update ContractProject
   * @param contractProject: updated ContractProject Object
   *************************************************************************/
  updateContractProject(contractProject: IContractProject): Observable<any> {
    return this.httpClient.put<IContractProject>(`${environment.contractProjectApiUrl}`, contractProject);
  }

  /**************************************************************************
   * @description Enable ContractProject Status
   * @param ID : of the ContractProject
   *************************************************************************/
  enableContractProject(ID: string): Observable<any> {
    return this.httpClient.put<IContractProject>(`${environment.contractProjectApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Disable ContractProject Status
   * @param ID : of ContractProject
   *************************************************************************/
  disableContractProject(ID: string): Observable<any> {
    return this.httpClient.delete<IContractProject>(`${environment.contractProjectApiUrl}/disable?_id=${ID}`);
  }
  /**************************************************************************
   * @description delete ContractProject Status
   * @param ID : of ContractProject
   *************************************************************************/
  deleteContractProject(ID: string): Observable<any> {
    return this.httpClient.delete<IContractProject>(`${environment.contractProjectApiUrl}?_id=${ID}`);
  }

  /*------------------------------COLLABORATOR PROJECT -----------------------------------*/

  /**************************************************************************
   * @description Get Contract Project List
   * @param filter: search query like [ ?id=123 ]
   * @returns All ContractProject Observable<IProjectCollaborator[]>
   *************************************************************************/
  getCollaboratorProject(filter: string): Observable<IProjectCollaborator[]> {
    return this.httpClient.get<IProjectCollaborator[]>(`${environment.projectCollaboratorApiUrl}${filter}` );
  }

  /**************************************************************************
   * @description Add new Project Collaborator
   * @param Contract: Contract Model
   *************************************************************************/
  addProjectCollaborator(ProjectCollaborator: IProjectCollaborator): Observable<any> {
    return this.httpClient.post<IContract>(`${environment.projectCollaboratorApiUrl}`, ProjectCollaborator);
  }
  /**************************************************************************
   * @description Update Date of Project
   * @param contract: updated project collaborator Object
   *************************************************************************/
  updateProjectCollaborator(ProjectCollaborator: IProjectCollaborator): Observable<any> {
    return this.httpClient.put<IProjectCollaborator>(`${environment.projectCollaboratorApiUrl}`, ProjectCollaborator);
  }
  /**************************************************************************
   * @description delete project affected to collaborator
   * @param ID: Of ProjectCollaborator
   *************************************************************************/
  deleteProjectCollaborator(ID: string): Observable<any> {
    return this.httpClient.delete<IProjectCollaborator>(`${environment.projectCollaboratorApiUrl}?_id=${ID}`);
  }

  /**************************************************************************
   * @description disable project affected to collaborator
   * @param ID: Of ProjectCollaborator
   *************************************************************************/
  disableProjectCollaborator(ID: string): Observable<any> {
    return this.httpClient.delete<IProjectCollaborator>(`${environment.projectCollaboratorApiUrl}/disable?_id=${ID}`);
  }

  /*------------------------------------------------------------------------*/
}
