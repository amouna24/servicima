import { ITimesheetKeyModel } from '@shared/models/timesheetKey.model';

export interface ITimesheetModel {
  /* ID */
  _id: string;
  TimeSheetKey: ITimesheetKeyModel;
  end_date: string;
  timesheet_status: string;
  comment?: string;
  monday?: number;
  tuesday?: number;
  wednesday?: number;
  thursday?: number;
  friday?: number;
  saturday?: number;
  sunday?: number;
  total_week_hours?: number;
  customer_timesheet?: string;
}
