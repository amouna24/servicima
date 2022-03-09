import { ITestSessionQuestionKeyModel } from '@shared/models/testSessionQuestionKey.model';

export interface ITestSessionQuestionModel {
  TestSessionQuestionsKey?: ITestSessionQuestionKeyModel;
  application_id: string;
  company_email: string;
  session_code: string;
  bloc_question_code: string;
  test_session_questions_code: string;
  test_question_code: string;
}
