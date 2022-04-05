import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { ITraining } from '@shared/models/training.model';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';
import { ITrainingRequest } from '@shared/models/trainingRequest.model';
import { ITrainingInviteCollaborator } from '@shared/models/trainingInviteCollaborator.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private httpClient: HttpClient) { }
  /*------------------------------------ TRAINING --------------------------------------*/
  /**************************************************************************
   * @description Add new Training
   * @param Training: Training Model
   *************************************************************************/
  addTraining(Training: ITraining): Observable<ITraining> {
    return this.httpClient.post<ITraining>(`${environment.hrTrainingApiUrl}`, Training);
  }
  /**************************************************************************
   * @description Update Training
   * @param bank: updated Training Object
   *************************************************************************/
  updateTraining(Training: any): Observable<any> {
    return this.httpClient.put<ITraining>(`${environment.hrTrainingApiUrl}`, Training);
  }
  /**************************************************************************
   * @description Delete Training
   * @param email_address: updated Training Object
   *************************************************************************/
  deleteTraining(_id: string): Observable<any> {
    return this.httpClient.delete(`${environment.hrTrainingApiUrl}?_id=${_id}`);
  }
  /**************************************************************************
   * @description get Training[]
   * @param email_address: string
   *************************************************************************/
  getTraining(filter: string): Observable<ITraining[]> {
    return this.httpClient
        .get<ITraining[]>(`${environment.hrTrainingApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Enable collaborator Status
   * @param code of the training
   *************************************************************************/
  enableTraining(code: string): Observable<any> {
    return this.httpClient.put<ITraining>(`${environment.hrTrainingApiUrl}/enable?training_code=${code}`, null);
  }
  /**************************************************************************
   * @description Disable collaborator Status
   * @param code of the training
   *************************************************************************/
  disableTraining(ID: string): Observable<any> {
    return this.httpClient.delete<ITraining>(`${environment.hrTrainingApiUrl}?_id=${ID}`);
  }
  /*------------------------------------ TRAINING SESSION WEEK --------------------------------------*/
  /**************************************************************************
   * @description Add new Training
   * @param Training: Training Model
   *************************************************************************/
  addTrainingSession(SessionTraining: any): Observable<ITrainingSessionWeek> {
    return this.httpClient.post<ITrainingSessionWeek>(`${environment.hrTrainingSessionWeekApiUrl}`, SessionTraining);
  }
  /**************************************************************************
   * @description Update Training
   * @param bank: updated Training Object
   *************************************************************************/
  updateTrainingSession(SessionTraining: any): Observable<any> {
    return this.httpClient.put<ITrainingSessionWeek>(`${environment.hrTrainingSessionWeekApiUrl}`, SessionTraining);
  }
  /**************************************************************************
   * @description Delete Training Session
   * @param email_address: updated Training Session Object
   *************************************************************************/
  deleteTrainingSession(_id: string): Observable<any> {
    return this.httpClient.delete(`${environment.hrTrainingSessionWeekApiUrl}?_id=${_id}`);
  }
  /**************************************************************************
   * @description get TrainingSession[]
   * @param email_address: string
   *************************************************************************/
  getTrainingSession(filter: string): Observable<ITrainingSessionWeek[]> {
    return this.httpClient
        .get<ITrainingSessionWeek[]>(`${environment.hrTrainingSessionWeekApiUrl}/${filter}`);
  }

  /*------------------------------------ TRAINING INVITE COLLABORATOR --------------------------------------*/
  /**************************************************************************
   * @description Add new Invitation for collaborator
   * @param RequestTraining: Training Request Model
   *************************************************************************/
  addTrainingInviteCollaborator(InviteCollaboratorTraining: any): Observable<ITrainingInviteCollaborator> {
    return this.httpClient.post<ITrainingInviteCollaborator>(`${environment.hrTrainingInviteCollaboratorApiUrl}`, InviteCollaboratorTraining);
  }
  /**************************************************************************
   * @description Update Training
   * @param bank: updated Training Object
   *************************************************************************/
  updateTrainingInviteCollaborator(InviteCollaboratorTraining: any): Observable<any> {
    return this.httpClient.put<ITrainingInviteCollaborator>(`${environment.hrTrainingInviteCollaboratorApiUrl}`, InviteCollaboratorTraining);
  }
  /**************************************************************************
   * @description Delete Training Request
   * @param _id: string
   *************************************************************************/
  deleteTrainingInviteCollaborator(_id: string): Observable<any> {
    return this.httpClient.delete(`${environment.hrTrainingInviteCollaboratorApiUrl}?_id=${_id}`);
  }
  /**************************************************************************
   * @description get TrainingRequest[]
   * @param email_address: string
   *************************************************************************/
  getTrainingInviteCollaborator(filter: string): Observable<ITrainingInviteCollaborator[]> {
    return this.httpClient
        .get<ITrainingInviteCollaborator[]>(`${environment.hrTrainingInviteCollaboratorApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Enable collaborator Status
   * @param code of the invite collaborator
   *************************************************************************/
  enableTrainingInviteCollaborator(ID: string): Observable<any> {
    return this.httpClient.put<ITrainingInviteCollaborator>(`${environment.hrTrainingInviteCollaboratorApiUrl}/enable?_id=${ID}`, null);
  }
  /**************************************************************************
   * @description Disable collaborator Status
   * @param code of the invite collaborator
   *************************************************************************/
  disableTrainingInviteCollaborator(ID: string): Observable<any> {
    return this.httpClient.delete<ITrainingInviteCollaborator>(`${environment.hrTrainingInviteCollaboratorApiUrl}?_id=${ID}`);
  }

  /*------------------------------------ TRAINING REQUEST --------------------------------------*/
  /**************************************************************************
   * @description Add new Training Request
   * @param RequestTraining: Training Request Model
   *************************************************************************/
  addTrainingRequest(RequestTraining: ITrainingRequest): Observable<ITrainingRequest> {
    return this.httpClient.post<ITrainingRequest>(`${environment.hrTrainingRequestApiUrl}`, RequestTraining);
  }
  /**************************************************************************
   * @description Update Training
   * @param bank: updated Training Object
   *************************************************************************/
  updateTrainingRequest(RequestTraining: any): Observable<any> {
    return this.httpClient.put<ITrainingSessionWeek>(`${environment.hrTrainingRequestApiUrl}`, RequestTraining);
  }
  /**************************************************************************
   * @description Delete Training Request
   * @param _id: string
   *************************************************************************/
  deleteTrainingRequest(_id: string): Observable<any> {
    return this.httpClient.delete(`${environment.hrTrainingRequestApiUrl}?_id=${_id}`);
  }
  /**************************************************************************
   * @description get TrainingRequest[]
   * @param email_address: string
   *************************************************************************/
  getTrainingRequest(filter: string): Observable<ITrainingRequest[]> {
    return this.httpClient
        .get<ITrainingRequest[]>(`${environment.hrTrainingRequestApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Enable collaborator Status
   * @param code of the training session
   *************************************************************************/
  enableTrainingRequest(code: string): Observable<any> {
    return this.httpClient.put<ITrainingRequest>(`${environment.hrTrainingRequestApiUrl}/enable?request_code=${code}`, null);
  }
  /**************************************************************************
   * @description Disable collaborator Status
   * @param code of the training session
   *************************************************************************/
  disableTrainingRequest(code: string): Observable<any> {
    return this.httpClient.delete<ITrainingSessionWeek>(`${environment.hrTrainingRequestApiUrl}/disable?session_code=${code}`);
  }
}
