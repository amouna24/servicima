import { ITimesheetSettingKey } from '@shared/models/timesheetSettingKey.model';

export interface ITimesheetSettingModel {

  /* Unique Key */
  timesheetSettingKey: ITimesheetSettingKey;

  /* Other fields */
  working_hour_day: number;
  sunday_rate: number;
  saturday_rate: number;
  holiday_rate: number;
  status: string;
}
