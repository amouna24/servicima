import { ApplicationKey } from './applicationKey.model';
export class ApplicationModel {
  /* ID */
  _id: string;
  ApplicationKey: ApplicationKey;
  application_desc: string;
  status: string;

  constructor() {
  }
}
