import { ITestSessionKeyModel } from '@shared/models/testSessionKey.model';

export interface ITestSessionModel {
  _id?: string;
  TestSessionKeyModel?: ITestSessionKeyModel;
  application_id: string;
  company_email: string;
  session_code: string;
  block_questions_code: string;
}
