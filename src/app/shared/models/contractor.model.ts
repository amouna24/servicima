import { IContractorKey } from '@shared/models/contractorKey.model';

export interface IContractor {
  /* ID */
  _id?: string;
  contractorKey?: IContractorKey;
  contractor_name: string;
  language?: string;
  registry_code?: string;
  legal_form?: string;
  vat_nbr?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  country_cd?: string;
  phone_nbr?: string;
  phone2_nbr?: string;
  fax_nbr?: string;
  contact_email?: string;
  web_site?: string;
  currency_cd?: string;
  tax_cd?: string;
  payment_cd?: string;
  creation_date?: number;
  update_date?: number;
  photo?: string;
  status?: string;
  activity_sector: string;
  application_id: string;
  email_address: string;
  contractor_code: string;
  contractor_type: string;
  template_resume?: string;
  update: boolean;
}
