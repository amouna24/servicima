import { ITimesheetTaskKeyModel } from '@shared/models/timesheetTaskKey.model';

export interface ITimesheetTaskModel {
  /* ID */
  _id: string;
  timesheetTaskKey: ITimesheetTaskKeyModel;
  task_desc?: string;
  start_date?: string;
  end_date?: string;
  task_status?: string;
  comment?: string;
}
