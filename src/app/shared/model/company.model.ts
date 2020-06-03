import { CompanyId } from './companyId.model';
export class CompanyModel {
  /* ID */
  _id: string;
  CompanyKey: CompanyId;
  address: string;
  legalForm: string;
  name: string;
  numberVAT: string;
  phoneContact: string;
  siret: string;
  socialReason: string;
  status: string;
}
