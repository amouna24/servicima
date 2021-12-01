import { IContractProjectKey } from './contractProjectKey.model';

export interface IContractProject {
  /* ID */
  _id?: string;
  ContractProjectKey?: IContractProjectKey;
  category_code?: string;
  project_desc: string;
  start_date: Date;
  end_date?: Date;
  project_rate?: string;
  rate_currency?: string;
  vat_nbr?: string;
  project_status?: string;
  comment: string;
  application_id: string;
  company_email: string;
  contract_code: string;
  project_code: string;
}
