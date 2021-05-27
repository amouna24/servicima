import { ITimesheetKeyModel } from '@shared/models/timesheetKey.model';

export interface ITimesheetModel {
  /* ID */
  _id: string;
  TimeSheetKey: ITimesheetKeyModel;
  start_date: string;
  end_date: string;
  timesheet_status: string;
  comment?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  total_week_hours?: string;
  type_timesheet?: string;
  customer_timesheet?: string;
}
