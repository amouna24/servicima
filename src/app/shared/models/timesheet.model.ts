import { ITimesheetKey } from '@shared/models/timesheetKey.model';

export interface ITimesheet {
  /* ID */
  _id: string;
  TimeSheetKey: ITimesheetKey;
  start_date?: string;
  end_date?: string;
  timesheet_status?: string;
  comment?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  total_week_hours?: string;
  customer_timesheet?: string;
}
