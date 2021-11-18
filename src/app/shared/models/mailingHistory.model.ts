import { IResumeMailingHistoryKeyModel } from '@shared/models/mailingHistoryKey.model';

export interface IResumeMailingHistoryModel {
  _id?: string;
  MailingHistoryKey: IResumeMailingHistoryKeyModel;
  subject: string;
  message: string;
  attachment: string[];
  copy: string[];
  hidden_copy: string[];
  application_id: string;
  company_email: string;
  send_time: Date;
  send_to: string;
  status?: string;
}
