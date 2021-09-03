import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICollaborator } from '@shared/models/collaborator.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  constructor(
    private httpClient: HttpClient,
  ) { }
  /*------------------------------------ Collaborator --------------------------------------*/

  /**************************************************************************
   * @description Get Resume List
   * @param filter search query like [ ?id=123 ]
   * @returns All Collaborators Observable<IContract[]>
   *************************************************************************/
  getCollaborator(filter: string): Observable<ICollaborator[]> {
    return this.httpClient.get<ICollaborator[]>(`${environment.collaboratorApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Collaborator
   * @param Collaborator: Collaborator Model
   *************************************************************************/
  addCollaborator(Collaborator: ICollaborator): Observable<any> {
    return this.httpClient.post<ICollaborator>(`${environment.collaboratorApiUrl}`, Collaborator);
  }

  /**************************************************************************
   * @description Update Collaborator Status
   * @param Collaborator: updated Collaborator Object
   *************************************************************************/
  updateResume(Collaborator: ICollaborator): Observable<any> {
    return this.httpClient.put<ICollaborator>(`${environment.collaboratorApiUrl}`, Collaborator);
  }

  /**************************************************************************
   * @description Enable Collaborator Status
   * @param ID of the Collaborator
   *************************************************************************/
  enableCollaborator(ID: string): Observable<any> {
    return this.httpClient.put<ICollaborator>(`${environment.collaboratorApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Disable Collaborator Status
   * @param ID : of the Collaborator
   *************************************************************************/
  disableCollaborator(ID: string): Observable<any> {
    return this.httpClient.delete<ICollaborator>(`${environment.collaboratorApiUrl}/disable?_id=${ID}`);
  }

  /*-------------------------------------------------------------------------------------*/
}
