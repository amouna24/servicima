import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { IResumeModel } from '@shared/models/resume.model';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { IResumeProjectDetailsModel } from '@shared/models/resumeProjectDetails.model';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';
import { IResumeCertificationModel } from '@shared/models/resumeCertification.model';

import { Observable, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

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

  /**************************************************************************
   * @description Delete Technical skills Status
   * @param id: Delete technical skills Object
   *************************************************************************/
  deleteTechnicalSkills(id: string): Observable<any> {
    return this.httpClient.delete<IResumeTechnicalSkillsModel>(`${environment.resumeTechnicalSkillsApiUrl}/?_id=${id}`);
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
    return this.httpClient.post<IResumeFunctionalSkillsModel>(`${environment.resumeFunctionalSkillsApiUrl}`, funcSkill);
  }

  /**************************************************************************
   * @description Update Functional skills Status
   * @param funcSkill: updated functional skills Object
   *************************************************************************/
  updateFunctionalSkills(funcSkill: IResumeFunctionalSkillsModel): Observable<any> {
    return this.httpClient.put<IResumeFunctionalSkillsModel>(`${environment.resumeFunctionalSkillsApiUrl}`, funcSkill);
  }

  /**************************************************************************
   * @description Delete Functional skills Status
   * @param id: Delete functional skills Object
   *************************************************************************/
  deleteFunctionalSkills(id: string): Observable<any> {
    return this.httpClient.delete<IResumeFunctionalSkillsModel>(`${environment.resumeFunctionalSkillsApiUrl}/?_id=${id}`);
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

  /**************************************************************************
   * @description Delete Intervention Status
   * @param id: Delete Intervention Object
   *************************************************************************/
  deleteIntervention(id: string): Observable<any> {
    return this.httpClient.delete<IResumeInterventionModel>(`${environment.resumeInterventionApiUrl}/?_id=${id}`);
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
   * @description Delete Language Status
   * @param id: Delete Language Object
   *************************************************************************/
  deleteLanguage(id: string): Observable<any> {
    return this.httpClient.delete<IResumeLanguageModel>(`${environment.resumeLanguageApiUrl}/?_id=${id}`);
  }

  /**************************************************************************
   * @description Update Language Status
   * @param language: updated  language Object
   *************************************************************************/
  updateLanguage(language: IResumeLanguageModel): Observable<any> {
    return this.httpClient.put<IResumeLanguageModel>(`${environment.resumeLanguageApiUrl}`, language);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------------ RESUME-PROFESSIONAL-EXPERIENCE--------------------------------------*/

  /**************************************************************************
   * @description Get Professional experience  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Professional experience Observable<ILanguage[]>
   *************************************************************************/
  getProExp(filter: string): Observable<IResumeProfessionalExperienceModel[]> {
    return this.httpClient.get<IResumeProfessionalExperienceModel[]>(`${environment.resumeProfessionalExperienceApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Professional experience
   * @param proExp: Professional experience model
   *************************************************************************/
  addProExp(proExp: IResumeProfessionalExperienceModel): Observable<any> {
    return this.httpClient.post<IResumeProfessionalExperienceModel>(`${environment.resumeProfessionalExperienceApiUrl}`, proExp);
  }

  /**************************************************************************
   * @description Update Professional experience Status
   * @param proExp: updated  Professional experience Object
   *************************************************************************/
  updateProExp(proExp: IResumeProfessionalExperienceModel): Observable<any> {
    return this.httpClient.put<IResumeProfessionalExperienceModel>(`${environment.resumeProfessionalExperienceApiUrl}`, proExp);
  }

  /**************************************************************************
   * @description Delete Professional experience Status
   * @param id: Delete Professional experience Object
   *************************************************************************/
  deleteProExp(id: string): Observable<any> {
    return this.httpClient.delete<IResumeProfessionalExperienceModel>(`${environment.resumeProfessionalExperienceApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------------ RESUME-CUSTOM-SECTION--------------------------------------*/

  /**************************************************************************
   * @description Get Custom Section  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Custom Section Observable<ISection[]>
   *************************************************************************/
  getCustomSection(filter: string): Observable<IResumeSectionModel[]> {
    return this.httpClient.get<IResumeSectionModel[]>(`${environment.resumeSectionApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Section
   * @param section: Section model
   *************************************************************************/
  addCustomSection(section: IResumeSectionModel): Observable<any> {
    return this.httpClient.post<IResumeSectionModel>(`${environment.resumeSectionApiUrl}`, section);
  }

  /**************************************************************************
   * @description Update Section Status
   * @param section: updated  Section Object
   *************************************************************************/
  updateCustomSection(section: IResumeSectionModel): Observable<any> {
    return this.httpClient.put<IResumeSectionModel>(`${environment.resumeSectionApiUrl}`, section);
  }

  /**************************************************************************
   * @description Delete Custom section Status
   * @param id: Delete Custom section Object
   *************************************************************************/
  deleteCustomSection(id: string): Observable<any> {
    return this.httpClient.delete<IResumeSectionModel>(`${environment.resumeSectionApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------------ RESUME-CERTIF-DIPLOMA--------------------------------------*/

  /**************************************************************************
   * @description Get Certif and diploma  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Certif and Diploma Observable<ICertifDiploma[]>
   *************************************************************************/
  getCertifDiploma(filter: string): Observable<IResumeCertificationDiplomaModel[]> {
    return this.httpClient.get<IResumeCertificationDiplomaModel[]>(`${environment.resumeCertifDiplomaApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Cerification and diploma
   * @param certifDiploma: Certification and diploma model
   *************************************************************************/
  addCertifDiploma(certifDiploma: IResumeCertificationDiplomaModel): Observable<any> {
    return this.httpClient.post<IResumeCertificationDiplomaModel>(`${environment.resumeCertifDiplomaApiUrl}`, certifDiploma);
  }

  /**************************************************************************
   * @description Update Certification and diploma Status
   * @param certifDiploma: updated  Certification and diploma Object
   *************************************************************************/
  updateCertifDiploma(certifDiploma: IResumeCertificationDiplomaModel): Observable<any> {
    return this.httpClient.put<IResumeCertificationDiplomaModel>(`${environment.resumeCertifDiplomaApiUrl}`, certifDiploma);
  }

  /**************************************************************************
   * @description Delete Certif diploma Status
   * @param id: Delete Certif diploma Object
   *************************************************************************/
  deleteCertifDiploma(id: string): Observable<any> {
    return this.httpClient.delete<IResumeCertificationDiplomaModel>(`${environment.resumeCertifDiplomaApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------------ RESUME-PROJECT--------------------------------------*/

  /**************************************************************************
   * @description Get Project  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Project Observable<IProject[]>
   *************************************************************************/
  getProject(filter: string): Observable<IResumeProjectModel[]> {
    return this.httpClient.get<IResumeProjectModel[]>(`${environment.resumeProjectApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Project
   * @param project : project model
   *************************************************************************/
  addProject(project: IResumeProjectModel): Observable<any> {
    return this.httpClient.post<IResumeProjectModel>(`${environment.resumeProjectApiUrl}`, project);
  }

  /**************************************************************************
   * @description Update Project Status
   * @param project: updated  Project Object
   *************************************************************************/
  updateProject(project: IResumeProjectModel): Observable<any> {
    return this.httpClient.put<IResumeProjectModel>(`${environment.resumeProjectApiUrl}`, project);
  }

  /**************************************************************************
   * @description Delete Project Status
   * @param id: Delete Project  Object
   *************************************************************************/
  deleteProject(id: string): Observable<any> {
    return this.httpClient.delete<IResumeProjectModel>(`${environment.resumeProjectApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------------ RESUME-PROJECT-DETAILS--------------------------------------*/

  /**************************************************************************
   * @description Get Project Details  List
   * @param filter search query like [ ?id=123 ]
   * @returns All Project Observable<IProjectDetails[]>
   *************************************************************************/
  getProjectDetails(filter: string): Observable<IResumeProjectDetailsModel[]> {
    return this.httpClient.get<IResumeProjectDetailsModel[]>(`${environment.resumeProjectDetailsApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Project Details
   * @param projectDet : Project model
   *************************************************************************/
  addProjectDetails(projectDet: IResumeProjectDetailsModel): Observable<any> {
    return this.httpClient.post<IResumeProjectDetailsModel>(`${environment.resumeProjectDetailsApiUrl}`, projectDet);
  }

  /**************************************************************************
   * @description Update Project Details Status
   * @param projectDet: updated  Project Details Object
   *************************************************************************/
  updateProjectDetails(projectDet: IResumeProjectDetailsModel): Observable<any> {
    return this.httpClient.put<IResumeProjectDetailsModel>(`${environment.resumeProjectDetailsApiUrl}`, projectDet);
  }

  /**************************************************************************
   * @description Delete Project Details Status
   * @param id: Delete Project Details Object
   *************************************************************************/
  deleteProjectDetails(id: string): Observable<any> {
    return this.httpClient.delete<IResumeProjectDetailsModel>(`${environment.resumeProjectDetailsApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------------ RESUME-PROJECT-DETAILS-Section--------------------------------------*/

  /**************************************************************************
   * @description Get Project Details Section List
   * @param filter search query like [ ?id=123 ]
   * @returns All Project Observable<IProjectDetailsSection[]>
   *************************************************************************/
  getProjectDetailsSection(filter: string): Observable<IResumeProjectDetailsSectionModel[]> {
    return this.httpClient.get<IResumeProjectDetailsSectionModel[]>(`${environment.resumeProjectDetailsSectionApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Project Section Details Section
   * @param projectDetSec : projectDetSec Section model
   *************************************************************************/
  addProjectDetailsSection(projectDetSec: IResumeProjectDetailsSectionModel): Observable<any> {
    return this.httpClient.post<IResumeProjectDetailsSectionModel>(`${environment.resumeProjectDetailsSectionApiUrl}`, projectDetSec);
  }

  /**************************************************************************
   * @description Update Project Details Section Status
   * @param projectDetSec: updated  Project Details Section Object
   *************************************************************************/
  updateProjectDetailsSection(projectDetSec: IResumeProjectDetailsSectionModel): Observable<any> {
    return this.httpClient.put<IResumeProjectDetailsSectionModel>(`${environment.resumeProjectDetailsSectionApiUrl}`, projectDetSec);
  }

  /**************************************************************************
   * @description Delete Project Details Section Status
   * @param id: Delete Project Details Section Object
   *************************************************************************/
  deleteProjectDetailsSection(id: string): Observable<any> {
    return this.httpClient.delete<IResumeProjectDetailsSectionModel>(`${environment.resumeProjectDetailsSectionApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/

  /*------------------------------------ RESUME-EXPORT--------------------------------------*/

  /**************************************************************************
   * @description Get Project Details Section List
   * @param filter search query like [ ?id=123 ]
   * @param theme set the theme design of the resume
   * @param type type format of the resume PDF or DOCX
   * @returns All Project Observable<IProjectDetailsSection[]>
   *************************************************************************/

  getResumePdf(filter: any, theme: string, type: string): Observable<any> {
    filter = JSON.parse(JSON.stringify(filter));
    // @ts-ignore
    return this.httpClient.post<any>(`${environment.docxTemplateApiUrl}/?type=${type}&theme=${theme}`, filter,   { responseType: 'blob'});
  }
  /*------------------------------------ RESUME-CERTIFICATION--------------------------------------*/

  /**************************************************************************
   * @description Get Certification List
   * @param filter search query like [ ?id=123 ]
   * @returns All Project Observable<IResumeCertificationModel[]>
   *************************************************************************/
  getCertification(filter: string): Observable<IResumeCertificationModel[]> {
    return this.httpClient.get<IResumeCertificationModel[]>(`${environment.resumeCertificationApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Certification
   * @param certif : IResumeCertificationModel  model
   *************************************************************************/
  addCertification(certif: IResumeCertificationModel): Observable<any> {
    return this.httpClient.post<IResumeCertificationModel>(`${environment.resumeCertificationApiUrl}`, certif);
  }

  /**************************************************************************
   * @description Update Certification Status
   * @param certif: updated  Certification Object
   *************************************************************************/
  updateCertification(certif: IResumeCertificationModel): Observable<any> {
    return this.httpClient.put<IResumeCertificationModel>(`${environment.resumeCertificationApiUrl}`, certif);
  }

  /**************************************************************************
   * @description Delete Certification Status
   * @param id: Delete Certification Object
   *************************************************************************/
  deleteCertification(id: string): Observable<any> {
    return this.httpClient.delete<IResumeCertificationModel>(`${environment.resumeCertificationApiUrl}/?_id=${id}`);
  }

  /*-------------------------------------------------------------------------------------*/
  sendMail(language_id, application_id, company_id, email_address, company_name, collaborator_position, attachement): Observable<any> {
    console.log('resume service');
    console.log(`${environment.resumeApiUrl}/mailing`);
    return this.httpClient.post<any>(`${environment.resumeApiUrl}/mailing`, {
      language_id,
      application_id,
      company_id,
      email_address,
      company_name,
      collaborator_position,
      attachement
    });
  }
  /*-------------------------------------------------------------------------------------*/
  sendMailManager(language_id, application_id, company_id, email_address, company_name, candidate_name, attachement): Observable<any> {
    console.log('resume service');
    return this.httpClient.post<any>(`${environment.resumeApiUrl}/mailingmanager`, {
      language_id,
      application_id,
      company_id,
      email_address,
      company_name,
      candidate_name,
      attachement
    });
  }
}
