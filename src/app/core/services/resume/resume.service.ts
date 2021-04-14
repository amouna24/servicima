import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IContract } from '@shared/models/contract.model';
import { environment } from '../../../../environments/environment';
import { IResumeModel } from '@shared/models/resume.model';
import { HttpClient } from '@angular/common/http';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(
    private httpClient: HttpClient,
  ) { }

/*------------------------------------ RESUME --------------------------------------*/

/**************************************************************************
 * @description Get Resume List
 * @param filter search query like [ ?id=123 ]
 * @returns All Resumes Observable<IContract[]>
 *************************************************************************/
getResume(filter: string): Observable<IResumeModel[]> {
  return this.httpClient.get<IResumeModel[]>(`${environment.resumeApiUrl}/${filter}`);
}

/**************************************************************************
 * @description Add new Resume
 * @param IResumeModel: Resume Model
 *************************************************************************/
addResume(Resume: IResumeModel): Observable<any> {
  return this.httpClient.post<IResumeModel>(`${environment.resumeApiUrl}`, Resume);
}

/**************************************************************************
 * @description Update Resume Status
 * @param resume: updated resume Object
 *************************************************************************/
updateResume(resume: IResumeModel): Observable<any> {
  return this.httpClient.put<IResumeModel>(`${environment.resumeApiUrl}`, resume);
}

/**************************************************************************
 * @description Enable Resume Status
 * @param ID of the resume
 *************************************************************************/
enableResume(ID: string): Observable<any> {
  return this.httpClient.put<IResumeModel>(`${environment.resumeApiUrl}/enable?_id=${ID}`, null);
}

/**************************************************************************
 * @description Disable Resume Status
 * @param ID : of the resume
 *************************************************************************/
disableResume(ID: string): Observable<any> {
  return this.httpClient.delete<IResumeModel>(`${environment.resumeApiUrl}/disable?_id=${ID}`);
}

/*-------------------------------------------------------------------------------------*/

/*------------------------------------ RESUME-TECHNICAL-SKILLS --------------------------------------*/

/**************************************************************************
 * @description Get Technical skills  List
 * @param filter search query like [ ?id=123 ]
 * @returns All Technical skills Observable<IContract[]>
 *************************************************************************/
getTechnicalSkills(filter: string): Observable<IResumeTechnicalSkillsModel[]> {
  return this.httpClient.get<IResumeTechnicalSkillsModel[]>(`${environment.resumeTechnicalSkillsApiUrl}/${filter}`);
}

/**************************************************************************
 * @description Add new Technical skill
 * @param techSkill: Technical skill model Model
 *************************************************************************/
addTechnicalSkills(techSkill: IResumeTechnicalSkillsModel): Observable<any> {
  return this.httpClient.post<IResumeTechnicalSkillsModel>(`${environment.resumeTechnicalSkillsApiUrl}`, techSkill);
}

/**************************************************************************
 * @description Update Technical skills Status
 * @param techSkill: updated technical skills Object
 *************************************************************************/
updateTechnicalSkills(techSkill: IResumeTechnicalSkillsModel): Observable<any> {
  return this.httpClient.put<IResumeTechnicalSkillsModel>(`${environment.resumeTechnicalSkillsApiUrl}`, techSkill);
}

/*-------------------------------------------------------------------------------------*/

}
