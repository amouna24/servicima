import { ITestQuestionBlocKeyModel } from '@shared/models/testQuestionBlocKey.model';

export interface ITestQuestionBlocModel {
  _id: string;
  TestQuestionBlocKey: ITestQuestionBlocKeyModel;
  test_question_bloc_title: string;
  test_question_bloc_desc: string;
  question_nbr: number;
  test_question_bloc_code: string;
  test_technology_code: string;
  application_id: string;
  company_email: string;
}
