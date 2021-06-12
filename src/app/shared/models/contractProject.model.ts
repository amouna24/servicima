import { IContractProjectKey } from './contractProjectKey.model';

export interface IContractProject {
  /* ID */
  _id?: string;
  ContractProjectKey?: IContractProjectKey;
  project_desc: string;
  start_date: Date;
  end_date?: Date;
  project_status?: string;
  comment: string;
  category_code?: number;
  project_rate?: string;
  rate_currency?: string;
  vat_nbr?: string;
  application_id: string;
  company_email: string;
  contract_code: string;
  project_code: string;
}
