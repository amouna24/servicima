import { IContractorContactKey } from '@shared/models/contractorContactKey.model';

export interface IContractorContact {
  /* ID */
  _id?: string;
  contractorContactKey?: IContractorContactKey;
  main_contact: string;
  can_sign_contract?: string;
  first_name?: string;
  last_name?: string;
  gender_cd?: string;
  title_cd?: string;
  phone_nbr?: string;
  cell_phone_nbr?: string;
  language_cd?: string;
  application_id: string;
  email_address: string;
  contractor_code: string;
  contact_email: string;

}
