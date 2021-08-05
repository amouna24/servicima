import { IResumeFunctionalSkillsKeyModel } from '@shared/models/resumeFunctionalSkillsKey.model';

export interface IResumeFunctionalSkillsModel {
  _id: string;
  ResumeFunctionalSkillsKey: IResumeFunctionalSkillsKeyModel;
  skill: string;
  index: number;
  functional_skills_code: string;
  resume_code: string;
}
