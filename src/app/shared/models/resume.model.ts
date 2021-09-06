import { IResumeKeyModel } from '@shared/models/resumeKey.model';

export interface IResumeModel {
  _id: string;
  ResumeKey: IResumeKeyModel;
  years_of_experience: number;
  actual_job: string;
  image: string;
  init_name: string;
  status: string;
  application_id: string;
  email_address: string;
  company_email: string;
  resume_code: string;
  language_id: string;
  resume_filename_pdf: string;
  resume_filename_docx: string;

}
