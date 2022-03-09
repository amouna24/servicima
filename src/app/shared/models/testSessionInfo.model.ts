import { ITestSessionInfoKeyModel } from '@shared/models/testSessionInfoKey.model';

export interface ITestSessionInfoModel {
  _id: string;
  TestSessionInfoKey: ITestSessionInfoKeyModel;
  session_name: string;
  level_code: string;
  test_session_timer_type: string;
  language_id: string;
  test_session_time: number;
  copy_paste: boolean;
  send_report: boolean;
  company_email: string;
  application_id: string;
  session_code: string;
  test_session_info_code: string;
}
