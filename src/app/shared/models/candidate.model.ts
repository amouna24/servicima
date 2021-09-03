import { ICandidateKeyModel } from '@shared/models/canidateKey.model';

export interface ICandidateModel {
  _id: string;
  candidateKey: ICandidateKeyModel;
  adress: string;
  zip_code: string;
  city: string;
  country_code: string;
  licence_id: string;
  experience_years: string;
  identity_type_id: string;
  identity_nbr: string;
  validity_start_date: string;
  validity_end_date: string;
  birth_date: string;
  birth_city: string;
  birth_country_id: string;
  nationality_id: string;
  status: string;
  application_id: string;
  email_address: string;
  type: string;
}
