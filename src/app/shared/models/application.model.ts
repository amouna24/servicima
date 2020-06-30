import { IApplicationKey } from './applicationKey.model';

export interface IApplicationModel {
  /* ID */
  _id: string;
  ApplicationKey: IApplicationKey;
  application_desc: string;
  status: string;

}
