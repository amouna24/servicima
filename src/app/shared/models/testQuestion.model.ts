import { ITestQuestionKeyModel } from '@shared/models/testQuestionKey.model';

export interface ITestQuestionModel {
  _id: string;
  TestQuestionKey: ITestQuestionKeyModel;
  to_display: string;
  order: string;
  mark: string;
  duration: string;
  language_id: string;
  question_type: string;
  code: string;
  language_tech: string;
  test_question_title: string;
  test_question_desc: string;
  test_question_code: string;
  test_question_bloc_code: string;
  application_id: string;
  test_level_code: string;
  company_email: string;
}
