import { ITestTechnologiesKeyModel } from '@shared/models/testTechnologiesKey.model';

export interface ITestTechnologiesModel {
  _id: string;
  TestTechnologyKey: ITestTechnologiesKeyModel;
  technology_title: string;
  test_technology_code: string;
  application_id: string;
}
