import { ICompanyId } from './companyKey.model';
export interface ICompanyModel {
  /* ID */
  _id: string;
  companyKey: ICompanyId;
  address: string;
  legalForm: string;
  company_name: string;
  numberVAT: string;
  phoneContact: string;
  siret: string;
  socialReason: string;
  status: string;
  photo: string;
  fax_nbr: string;
  phone_nbr1: string;
  phone_nbr2: string;
  whatsapp_url: string;
  facebook_url: string;
  skype_url: string;
  other_url: string;
  instagram_url: string;
  viber_url: string;
  linkedin_url: string;
  twitter_url: string;
  youtube_url: string;
}
