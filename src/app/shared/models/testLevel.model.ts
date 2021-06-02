import { ITestLevelKeyModel } from '@shared/models/testLevelKey.model';

export interface ITestLevelModel {
  _id: string;
  TestLevelKey: ITestLevelKeyModel;
  test_level_title: string;
  test_level_code: string;
  application_id: string;
}
