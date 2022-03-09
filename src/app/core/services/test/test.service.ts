import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ITestChoicesModel } from '@shared/models/testChoices.model';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { ITestLevelModel } from '@shared/models/testLevel.model';
import { ITestTechnologiesModel } from '@shared/models/testTechnologies.model';
import { ITestSkillsModel } from '@shared/models/testSkills.model';
import { ITestTechnologySkillsModel } from '@shared/models/testTechnologySkills.model';
import { ITestSessionInfoModel } from '@shared/models/testSessionInfo.model';
import { ITestSessionModel } from '@shared/models/testSession.model';
import { ITestSessionQuestionModel } from '@shared/models/testSessionQuestion.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  /*------------------------------------ Question --------------------------------------*/
  /**************************************************************************
   * @description Get Question List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test Choices Observable<ITestChoices[]>
   *************************************************************************/
  getQuestion(filter: string): Observable<ITestQuestionModel[]> {
    return this.httpClient.get<ITestQuestionModel[]>(`${environment.testQuestionApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new choice
   * @param  question: Choice Model
   *************************************************************************/
  addQuestion(question: ITestQuestionModel): Observable<any> {
    return this.httpClient.post<ITestQuestionModel>(`${environment.testQuestionApiUrl}`, question);
  }

  /**************************************************************************
   * @description Update question Status
   * @param question: updated question Object
   *************************************************************************/
  updateQuestion(question: ITestQuestionModel): Observable<any> {
    return this.httpClient.put<ITestQuestionModel>(`${environment.testQuestionApiUrl}`, question);
  }
  /**************************************************************************
   * @description Delete test Question Status
   * @param id: Delete test Question Object
   *************************************************************************/
  deleteQuestion(id: string): Observable<any> {
    return this.httpClient.delete<ITestQuestionModel>(`${environment.testQuestionApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Question Bloc --------------------------------------*/
  /**************************************************************************
   * @description Get question bloc List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test question bloc Observable<ITestQuestionBloc[]>
   *************************************************************************/
  getQuestionBloc(filter: string): Observable<ITestQuestionBlocModel[]> {
    return this.httpClient.get<ITestQuestionBlocModel[]>(`${environment.testQuestionBlocApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new question bloc
   * @param  questionBloc: bloc qustion Model
   *************************************************************************/
  addQuestionBloc(questionBloc: ITestQuestionBlocModel): Observable<any> {
    return this.httpClient.post<ITestQuestionBlocModel>(`${environment.testQuestionBlocApiUrl}`, questionBloc);
  }

  /**************************************************************************
   * @description Update question bloc Status
   * @param questionBloc: updated question bloc Object
   *************************************************************************/
  updateQuestionBloc(questionBloc: ITestQuestionBlocModel): Observable<any> {
    return this.httpClient.put<ITestQuestionBlocModel>(`${environment.testQuestionBlocApiUrl}`, questionBloc);
  }
  /**************************************************************************
   * @description Delete test choice Status
   * @param id: Delete test choice Object
   *************************************************************************/
  deleteQuestionBloc(id: string): Observable<any> {
    return this.httpClient.delete<ITestQuestionBlocModel>(`${environment.testQuestionBlocApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Level --------------------------------------*/
  /**************************************************************************
   * @description Get Level List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test Choices Observable<ITestLevel[]>
   *************************************************************************/
  getLevel(filter: string): Observable<ITestLevelModel[]> {
    return this.httpClient.get<ITestLevelModel[]>(`${environment.testLevelApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new level
   * @param  level: level Model
   *************************************************************************/
  addLevel(level: ITestLevelModel): Observable<any> {
    return this.httpClient.post<ITestLevelModel>(`${environment.testLevelApiUrl}`, level);
  }

  /**************************************************************************
   * @description Update level Status
   * @param level: updated level Object
   *************************************************************************/
  updateLevel(level: ITestLevelModel): Observable<any> {
    return this.httpClient.put<ITestLevelModel>(`${environment.testLevelApiUrl}`, level);
  }
  /**************************************************************************
   * @description Delete test level Status
   * @param id: Delete test level Object
   *************************************************************************/
  deleteLevel(id: string): Observable<any> {
    return this.httpClient.delete<ITestLevelModel>(`${environment.testLevelApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Technologies --------------------------------------*/
  /**************************************************************************
   * @description Get technologies List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test  technologies Observable<ITestTechnologies[]>
   *************************************************************************/
  getTechnologies(filter: string): Observable<ITestTechnologiesModel[]> {
    return this.httpClient.get<ITestTechnologiesModel[]>(`${environment.testTechnologiesApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new technology
   * @param  technology: technology Model
   *************************************************************************/
  addTechnologies(technology: ITestTechnologiesModel): Observable<any> {
    return this.httpClient.post<ITestTechnologiesModel>(`${environment.testTechnologiesApiUrl}`, technology);
  }

  /**************************************************************************
   * @description Update technology Status
   * @param technology: updated technology Object
   *************************************************************************/
  updateTechnologies(technology: ITestTechnologiesModel): Observable<any> {
    return this.httpClient.put<ITestTechnologiesModel>(`${environment.testTechnologiesApiUrl}`, technology);
  }
  /**************************************************************************
   * @description Delete test technology Status
   * @param id: Delete test technology Object
   *************************************************************************/
  deleteTechnologies(id: string): Observable<any> {
    return this.httpClient.delete<ITestTechnologiesModel>(`${environment.testTechnologiesApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Skills --------------------------------------*/
  /**
   * @description get refData with specific refType and code refData
   * @param skill_title: company
   * @param level :application
   * @param application: code refData
   */
  getSpecificSkill(application: string, level: string, skill_title: string) {
    return this.httpClient
      .get<ITestSkillsModel[]>
      (`${environment.refDataApiUrl}?application_id=${application}&skill_title=${skill_title}&test_level_code=${level}`);
  }
  /**************************************************************************
   * @description Get Skills List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test Skills Observable<ITestSkills[]>
   *************************************************************************/
  getSkills(filter: string): Observable<ITestSkillsModel[]> {
    return this.httpClient.get<ITestSkillsModel[]>(`${environment.testSkillsApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new skill
   * @param  skill: skill Model
   *************************************************************************/
  addSkills(skill: ITestSkillsModel): Observable<any> {
    return this.httpClient.post<ITestSkillsModel>(`${environment.testSkillsApiUrl}`, skill);
  }

  /**************************************************************************
   * @description Update skill Status
   * @param skill: updated skill Object
   *************************************************************************/
  updateSkills(skill: ITestSkillsModel): Observable<any> {
    return this.httpClient.put<ITestSkillsModel>(`${environment.testSkillsApiUrl}`, skill);
  }
  /**************************************************************************
   * @description Delete test skill Status
   * @param id: Delete test skill Object
   *************************************************************************/
  deleteSkills(id: string): Observable<any> {
    return this.httpClient.delete<ITestSkillsModel>(`${environment.testSkillsApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Technology Skills --------------------------------------*/
  /**************************************************************************
   * @description Get Technology Skills List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test Technology Skills Observable<ITestTechnologySkills[]>
   *************************************************************************/
  getTechnologySkills(filter: string): Observable<ITestTechnologySkillsModel[]> {
    return this.httpClient.get<ITestTechnologySkillsModel[]>(`${environment.testTechnologySkillsApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new Technology Skills
   * @param  technologySkills: Technology Skills Model
   *************************************************************************/
  addTechnologySkills(technologySkills: ITestTechnologySkillsModel): Observable<any> {
    return this.httpClient.post<ITestTechnologySkillsModel>(`${environment.testTechnologySkillsApiUrl}`, technologySkills);
  }

  /**************************************************************************
   * @description Update technologySkills Status
   * @param technologySkills: updated technologySkills Object
   *************************************************************************/
  updateTechnologySkills(technologySkills: ITestTechnologySkillsModel): Observable<any> {
    return this.httpClient.put<ITestTechnologySkillsModel>(`${environment.testTechnologySkillsApiUrl}`, technologySkills);
  }
  /**************************************************************************
   * @description Delete test technologySkills Status
   * @param id: Delete test technologySkills Object
   *************************************************************************/
  deleteTechnologySkills(id: string): Observable<any> {
    return this.httpClient.delete<ITestTechnologySkillsModel>(`${environment.testTechnologySkillsApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Choices --------------------------------------*/
  /**************************************************************************
   * @description Get Choices List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test Choices Observable<ITestChoices[]>
   *************************************************************************/
  getChoices(filter: string): Observable<ITestChoicesModel[]> {
    return this.httpClient.get<ITestChoicesModel[]>(`${environment.testChoicesApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new choice
   * @param  choice: Choice Model
   *************************************************************************/
  addChoice(choice: ITestChoicesModel): Observable<any> {
    return this.httpClient.post<ITestChoicesModel>(`${environment.testChoicesApiUrl}`, choice);
  }

  /**************************************************************************
   * @description Update choice Status
   * @param choice: updated choice Object
   *************************************************************************/
  updateChoice(choice: ITestChoicesModel): Observable<any> {
    return this.httpClient.put<ITestChoicesModel>(`${environment.testChoicesApiUrl}`, choice);
  }
  /**************************************************************************
   * @description Delete test choice Status
   * @param id: Delete test choice Object
   *************************************************************************/
  deleteChoice(id: string): Observable<any> {
    return this.httpClient.delete<ITestChoicesModel>(`${environment.testChoicesApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Test Session Info --------------------------------------*/
  /**************************************************************************
   * @description add test session info
   * @param sessionInfo: session information
   *************************************************************************/
  addTestSessionInfo(sessionInfo): Observable<any> {
    return this.httpClient.post<ITestSessionInfoModel>(`${environment.testSessionInfoApiUrl}`, sessionInfo);
  }
  /**************************************************************************
   * @description Get Session info List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test Choices Observable<ITestInfo[]>
   *************************************************************************/
  getSessionInfo(filter: string): Observable<ITestSessionInfoModel[]> {
    return this.httpClient.get<ITestSessionInfoModel[]>(`${environment.testSessionInfoApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Update choice Status
   * @param choice: updated choice Object
   *************************************************************************/
  updateSessionInfo(sessionInfo: ITestSessionInfoModel): Observable<any> {
    return this.httpClient.put<ITestSessionInfoModel>(`${environment.testSessionInfoApiUrl}`, sessionInfo);
  }
  /**************************************************************************
   * @description Delete test choice Status
   * @param id: Delete test choice Object
   *************************************************************************/
  deleteSessionInfo(id: string): Observable<any> {
    return this.httpClient.delete<ITestSessionModel>(`${environment.testSessionInfoApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Test Session --------------------------------------*/
  /**************************************************************************
   * @description Get Session List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test session Observable<ITestSessionModel[]>
   *************************************************************************/
  getSession(filter: string): Observable<ITestSessionModel[]> {
    return this.httpClient.get<ITestSessionModel[]>(`${environment.testSessionApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new session
   * @param  session: session Model
   *************************************************************************/
  addSession(session: ITestSessionModel): Observable<any> {
    return this.httpClient.post<ITestSessionModel>(`${environment.testSessionApiUrl}`, session);
  }

  /**************************************************************************
   * @description Update choice Status
   * @param choice: updated choice Object
   *************************************************************************/
  updateSession(session: ITestSessionModel): Observable<any> {
    return this.httpClient.put<ITestSessionModel>(`${environment.testSessionApiUrl}`, session);
  }
  /**************************************************************************
   * @description Get Session List in data table format
   * @param filter search query like [ ?id=123 ]
   * @returns All Test session Observable<ITestSessionModel[]>
   *************************************************************************/
  getSessionDataTable(filter: string): Observable<ITestSessionModel[]> {
    return this.httpClient.get<ITestSessionModel[]>(`${environment.testSessionApiUrl}/datatable/${filter}`);
  }
  /**************************************************************************
   * @description Delete test choice Status
   * @param id: Delete test choice Object
   *************************************************************************/
  deleteSession(id: string): Observable<any> {
    return this.httpClient.delete<ITestSessionModel>(`${environment.testSessionApiUrl}/?_id=${id}`);
  }
  /*------------------------------------ Test Session Questions --------------------------------------*/
  /**************************************************************************
   * @description add test session question
   * @param sessionQuestion: session question
   *************************************************************************/
  addTestSessionQuestion(sessionQuestion): Observable<any> {
    return this.httpClient.post<ITestSessionQuestionModel>(`${environment.testSessionQuestionsApiUrl}`, sessionQuestion);
  }
  /**************************************************************************
   * @description Get Session question List
   * @param filter search query like [ ?id=123 ]
   * @returns All Test question Observable<ITestInfo[]>
   *************************************************************************/
  getSessionQuestion(filter: string): Observable<ITestSessionQuestionModel[]> {
    return this.httpClient.get<ITestSessionQuestionModel[]>(`${environment.testSessionQuestionsApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Update question Status
   * @param sessionQuestion: updated question Object
   *************************************************************************/
  updateSessionQuestion(sessionQuestion: ITestSessionQuestionModel): Observable<any> {
    return this.httpClient.put<ITestSessionQuestionModel>(`${environment.testSessionQuestionsApiUrl}`, sessionQuestion);
  }
  /**************************************************************************
   * @description Delete test question Status
   * @param id: Delete test question Object
   *************************************************************************/
  deleteSessionQuestion(id: string): Observable<any> {
    return this.httpClient.delete<ITestSessionQuestionModel>(`${environment.testSessionQuestionsApiUrl}/?_id=${id}`);
  }
}
