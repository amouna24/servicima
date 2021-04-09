import { ICompanyTimesheetSettingKey } from './companyTimesheetSettingKey.model';

export interface IContract {
  /* ID */
  _id: string;
  CompanyTimesheetSettingKey: ICompanyTimesheetSettingKey;
  working_hour_day: number;
  sunday_rate: number;
  saturday_rate?: number;
  holiday_rate?: number;
}
