import { ApplicationKey } from './applicationKey.model';
export interface ApplicationModel {
  /* ID */
  _id: string;
  ApplicationKey: ApplicationKey;
  application_desc: string;
  status: string;

}
