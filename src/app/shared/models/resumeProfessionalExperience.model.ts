import { IResumeProfessionalExperienceKeyModel } from '@shared/models/resumeProfessionalExperienceKey.model';

export interface IResumeProfessionalExperienceModel {
  _id: string;
  ResumeProfessionalExperienceKey: IResumeProfessionalExperienceKeyModel;
  position: string;
  customer: string;
  professional_experience_code: string;
  resume_code: string;
  start_date: string;
  end_date: string;
}
