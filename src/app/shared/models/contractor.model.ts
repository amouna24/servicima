import { IContractorKey } from '@shared/models/contractorKey.model';

export interface IContractor {
  /* ID */
  _id: string;
  contractorKey: IContractorKey;
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
  taxe_cd?: string;
  payment_cd?: string;
  creation_date?: Date;
  update_date?: Date;
  photo?: string;
  status?: string;
}
