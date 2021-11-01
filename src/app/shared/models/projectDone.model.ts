import { IResumeProjectKeyModel } from '@shared/models/resumeProjectKey.model';
import { IResumeProjectDetailsDoneModel } from '@shared/models/projectDetailsDone.model';

export interface IResumeProjectDoneModel {
  _id: string;
  ResumeProjectKey: IResumeProjectKeyModel;
  start_date: string;
  end_date: string;
  project_title: string;
  project_code: string;
  professional_experience_code: string;
  position: string;
  client: string;
  projectDetails: IResumeProjectDetailsDoneModel[];
}
