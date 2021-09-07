import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICandidateModel } from '@shared/models/candidate.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    private httpClient: HttpClient,
  ) { }
  /*------------------------------------ Collaborator --------------------------------------*/

  /**************************************************************************
   * @description Get Candidate List
   * @param filter search query like [ ?id=123 ]
   * @returns All Candidate Observable<ICandidate[]>
   *************************************************************************/
  getCandidate(filter: string): Observable<ICandidateModel[]> {
    return this.httpClient.get<ICandidateModel[]>(`${environment.candidateApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Candidate
   * @param Candidate: Candidate Model
   *************************************************************************/
  addCandidate(Candidate: ICandidateModel): Observable<any> {
    return this.httpClient.post<ICandidateModel>(`${environment.candidateApiUrl}`, Candidate);
  }

  /**************************************************************************
   * @description Update Candidate Status
   * @param Candidate: updated Candidate Object
   *************************************************************************/
  updateCandidate(Candidate: ICandidateModel): Observable<any> {
    return this.httpClient.put<ICandidateModel>(`${environment.candidateApiUrl}`, Candidate);
  }

  /**************************************************************************
   * @description Delete Candidate
   * @param id: Id of the deleted candidate
   *************************************************************************/
  deleteCandidate(id: string): Observable<any> {
    return this.httpClient.delete<ICandidateModel>(`${environment.candidateApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/}
