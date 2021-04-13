import { ICompanyTimesheetSettingKey } from '@shared/models/companyTimesheetSettingKey.model';

export interface ICompanyTimesheetSettingModel {

  /* Unique Key */
  companyTimesheetSettingKey: ICompanyTimesheetSettingKey;

  /* Other fields */
  working_hour_day: number;
  sunday_rate: number;
  saturday_rate: number;
  holiday_rate: number;
  status: string;
}
