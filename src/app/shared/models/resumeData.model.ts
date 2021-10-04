import { IResumeDataKeyModel } from '@shared/models/resumeDataKey.model';

export interface IResumeDataModel {
  ResumeDataKey: IResumeDataKeyModel;
  name: string;
  role: string;
  experience: number;
  image_url: string;
  diplomas: object[];
  certifications: object[];
  technical_skills: object[];
  functional_skills: object[];
  intervention: object[];
  professional_experiences: object[];
  languages: object[];
  sections: object[];
  update: boolean;
  application_id: string;
  resume_code: string;
  collaborator_email: string;
  company_email: string;
}
