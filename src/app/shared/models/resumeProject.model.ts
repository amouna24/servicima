import { IResumeProjectKeyModel } from '@shared/models/resumeProjectKey.model';

export interface IResumeProjectModel {
  _id: string;
  ResumeProjectKey: IResumeProjectKeyModel;
  start_date: string;
  end_date: string;
  project_title: string;
  project_code: string;
  professional_experience_code: string;
  client: string;
  position: string;
}
