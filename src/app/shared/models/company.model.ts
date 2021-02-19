import { ICompanyId } from './companyKey.model';
export interface ICompanyModel {
  /* ID */
  _id: string;
  companyKey: ICompanyId;
  address: string;
  legalForm: string;
  name: string;
  numberVAT: string;
  phoneContact: string;
  siret: string;
  socialReason: string;
  status: string;
  photo: string;
  fax_nbr: string;
  phone_nbr1: string;
  phone_nbr2: string;
}
