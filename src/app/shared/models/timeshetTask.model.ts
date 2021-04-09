import { ITimesheetTaskKey } from '@shared/models/timesheetTaskKey.model';

export interface ITimesheetTask {
  /* ID */
  _id: string;
  timesheetTaskKey: ITimesheetTaskKey;
  task_desc?: string;
  start_date?: string;
  end_date?: string;
  task_status?: string;
  comment?: string;
}
