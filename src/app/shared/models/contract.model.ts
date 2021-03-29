import { IContractKey } from './contractKey.model';

export interface IContract {
  /* ID */
  _id: string;
  contractKey: IContractKey;
  contractor_code: string;
  collaborator_email: string;
  contract_start_date?: Date;
  contract_end_date?: Date;
  contract_date: Date;
  contract_status?: number;
  signer_company_email?: string;
  signer_contractor_email?: string;
  signature_company_date?: Date;
  signature_contractor_date?: Date;
  contract_rate: number;
  currency_cd?: string;
  payment_terms: string;
  attachments?: string;
}
