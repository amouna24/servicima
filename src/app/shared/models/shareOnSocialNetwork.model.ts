import { IShareOnSocialNetworkKeyModel } from '@shared/models/shareOnSocialNetworkKey.model';

export interface IShareOnSocialNetworkModel {
  _id?: string;
  ShareOnSocialNetworkKey: IShareOnSocialNetworkKeyModel;
  title: string;
  text: string;
  image: string;
  published: boolean;
  application_id: string;
  company_email: string;
  linkedin_email: string;
  date: Date;
}
