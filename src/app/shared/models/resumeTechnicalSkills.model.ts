import { IResumeTechnicalSkillsKeyModel } from '@shared/models/resumeTechnicalSkillsKey.model';

export interface IResumeTechnicalSkillsModel {
  _id: string;
  ResumeTechnicalSkillsKey: IResumeTechnicalSkillsKeyModel;
  technical_skill_desc: string;
  technologies: string;
  technical_skill_code: string;
  resume_code: string;
  skill_index: string;
}
