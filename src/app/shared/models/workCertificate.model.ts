import { IWorkCertificateKey } from './workCertificateKey.model';

export interface IWorkCertificate {
  /* ID */
  HRWorkCertificateKey: IWorkCertificateKey;
  _id: string;
  /* Other fields */
  request_type: string;
  request_status: string;
  request_date: string;
  response_date: string;
  comment: string;
  language: string;
  attachment_doc: string;
  status: string;
  full_name?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  nationlity_id?: string;
  position?: string;
  photo?: string;
}
