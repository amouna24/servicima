import { ITimesheetProjectKeyModel } from '@shared/models/timesheetProjectKey.model';

export interface ITimesheetProjectModel {
  /* ID */
  _id: string;
  TimesheetProjectKey: ITimesheetProjectKeyModel;
  project_desc?: string;
  start_date?: string;
  end_date?: string;
  project_status?: string;
  comment?: string;
  category_code?: string;
}
