import { ICompanyId } from './companyId.model';
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
}
