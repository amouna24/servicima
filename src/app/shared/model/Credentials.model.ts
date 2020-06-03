import { CredentialsKey } from './CredentialsKey.model';

export class CredentialsModel {
  CredentialsKey:CredentialsKey;
  password :String;
  activation_code :String;
  code_expiry_date : Date;
  creation_date : String;
  created_by :String;
  update_date :String;
  updated_by :String;
  last_connection :String;
  refresh_token : String;
  status : String;
}
