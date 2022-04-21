import { ITestChoicesKeyModel } from '@shared/models/testChoicesKey.model';

export interface ITestChoicesModel {
  _id: string;
  TestChoicesKey: ITestChoicesKeyModel;
  language_id: string;
  choice_title: string;
  correct_choice: string;
  test_choices_code: string;
  test_question_code: string;
  application_id: string;
  company_email: string;
}
