import { IPhotoModel } from './photo.model';
import { IUserKeyModel } from './userKey.model';
export interface IUserModel {
  userKey: IUserKeyModel;
  status: string;
  company_email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  gender_id: string;
  prof_phone: string;
  cellphone_nbr: string;
  language_id: string;
  title_id: string;
  linkedin_url: string;
  twitter_url: string;
  youtube_url: string;
  creation_date: string;
  created_by: string;
  update_date: string;
  updated_by: string;
  application_id: string;
  email_address: string;
  photo: IPhotoModel;
}
