import { ITestSkillsKeyModel } from '@shared/models/testSkillsKey.model';

export interface ITestSkillsModel {
  _id: string;
  TestSkillsKey: ITestSkillsKeyModel;
  skill_title: string;
  test_level_code: string;
  test_skill_code: string;
  application_id: string;
}
