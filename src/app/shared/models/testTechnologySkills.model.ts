import { ITestTechnologySkillsKeyModel } from '@shared/models/testTechnologySkillsKey.model';

export interface ITestTechnologySkillsModel {
  _id?: string;
  TestTechnologySkillKey?: ITestTechnologySkillsKeyModel;
  application_id: string;
  test_technology_code: string;
  test_skill_code: string;

}
