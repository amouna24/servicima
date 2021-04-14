import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { IResumeModel } from '@shared/models/resume.model';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {IResumeInterventionModel} from "@shared/models/resumeIntervention.model";
import {IResumeLanguageModel} from "@shared/models/resumeLanguage.model";

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
  /*------------------------------------ RESUME-FUNCTIONAL-SKILLS --------------------------------------*/

  /**************************************************************************
   * @description Get Functional skills  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Functional skills Observable<IContract[]>
   *************************************************************************/
  getFunctionalSkills(filter: string): Observable<IResumeFunctionalSkillsModel[]> {
    return this.httpClient.get<IResumeFunctionalSkillsModel[]>(`${environment.resumeFunctionalSkillsApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Functional skill
   * @param funcSkill: Functional skill model
   *************************************************************************/
  addFunctionalSkills(funcSkill: IResumeFunctionalSkillsModel): Observable<any> {
    return this.httpClient.post<IResumeFunctionalSkillsModel>(`${environment.resumeTechnicalSkillsApiUrl}`, funcSkill);
  }

  /**************************************************************************
   * @description Update Functional skills Status
   * @param funcSkill: updated functional skills Object
   *************************************************************************/
  updateFunctionalSkills(funcSkill: IResumeFunctionalSkillsModel): Observable<any> {
    return this.httpClient.put<IResumeFunctionalSkillsModel>(`${environment.resumeFunctionalSkillsApiUrl}`, funcSkill);
  }

  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ RESUME-INTERVENTION --------------------------------------*/

  /**************************************************************************
   * @description Get Intervention  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Intervention Observable<IContract[]>
   *************************************************************************/
  getIntervention(filter: string): Observable<IResumeInterventionModel[]> {
    return this.httpClient.get<IResumeInterventionModel[]>(`${environment.resumeInterventionApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Intervention
   * @param intervention: Intervention model
   *************************************************************************/
  addIntervention(intervention: IResumeInterventionModel): Observable<any> {
    return this.httpClient.post<IResumeInterventionModel>(`${environment.resumeInterventionApiUrl}`, intervention);
  }

  /**************************************************************************
   * @description Update Intervention Status
   * @param intervention: updated intervention Object
   *************************************************************************/
  updateIntervention(intervention: IResumeInterventionModel): Observable<any> {
    return this.httpClient.put<IResumeInterventionModel>(`${environment.resumeInterventionApiUrl}`, intervention);
  }

  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ RESUME-LANGUAGE--------------------------------------*/

  /**************************************************************************
   * @description Get Language  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Intervention Observable<ILanguage[]>
   *************************************************************************/
  getLanguage(filter: string): Observable<IResumeLanguageModel[]> {
    return this.httpClient.get<IResumeLanguageModel[]>(`${environment.resumeLanguageApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Lanaguage
   * @param language: Language model
   *************************************************************************/
  addLanguage(language: IResumeLanguageModel): Observable<any> {
    return this.httpClient.post<IResumeLanguageModel>(`${environment.resumeLanguageApiUrl}`, language);
  }

  /**************************************************************************
   * @description Update Language Status
   * @param language: updated  language Object
   *************************************************************************/
  updateLanguage(language: IResumeLanguageModel): Observable<any> {
    return this.httpClient.put<IResumeLanguageModel>(`${environment.resumeLanguageApiUrl}`, language);
  }

  /*-------------------------------------------------------------------------------------*/
}
