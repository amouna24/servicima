import { IResumeProfessionalExperienceKeyModel } from '@shared/models/resumeProfessionalExperienceKey.model';
import { IResumeProjectDoneModel } from '@shared/models/projectDone.model';

export interface IResumeProfessionalExperienceDoneModel {
  _id: string;
  ResumeProfessionalExperienceKey: IResumeProfessionalExperienceKeyModel;
  position: string;
  customer: string;
  professional_experience_code: string;
  resume_code: string;
  start_date: string;
  end_date: string;
  projects: IResumeProjectDoneModel[];
}
