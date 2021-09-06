import { ICollaboratorKey } from '@shared/models/collaboratorKey.model';

export interface ICollaborator {
  /* ID */
  _id?: string;
  collaboratorKey: ICollaboratorKey;
  adress?: string;
  zip_code?: string;
  country_id?: string;
  family_situation_id?: string;
  nationality_id?: string;
  birth_date?: string;
  birth_city?: string;
  birth_country_id?: string;
  birth_name?: string;
  manager_email?: string;
  calendar_id?: string;
  departement_id?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  bank_name?: string;
  bank_iban?: string;
  rib_key?: string;
  medical_exam_date?: string;
  status?: string;
  application_id: string;
  email_address: string;
}
