import { ICredentialsKey } from './credentialsKey.model';

export interface ICredentialsModel {
  credentialsKey: ICredentialsKey;
  password: string;
  activation_code: string;
  code_expiry_date: Date;
  creation_date: string;
  created_by: string;
  update_date: string;
  updated_by: string;
  last_connection: string;
  refresh_token: string;
  status: string;
}
