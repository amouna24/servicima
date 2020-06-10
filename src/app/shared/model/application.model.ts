import { IApplicationKey } from './applicationKey.model';

export interface IApplicationModel {
  /* ID */
  _id: string;
  applicationKey: IApplicationKey;
  application_desc: string;
  status: string;

}
