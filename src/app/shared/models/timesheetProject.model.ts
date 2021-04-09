import { ITimesheetProjectKey } from '@shared/models/timesheetProjectKey.model';

export interface ITimesheetProject {
  /* ID */
  _id: string;
  TimesheetProjectKey: ITimesheetProjectKey;
  project_desc?: string;
  start_date?: string;
  end_date?: string;
  project_status?: string;
  comment?: string;
}
