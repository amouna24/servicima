import { IHrContractKey } from '@shared/models/hrContractKey.model';

export interface IHrContract {
  /* ID */
  HRContractKey: IHrContractKey;
  _id: string;
  contract_start_date: string;
  contract_end_date: string;
  contract_date: string;
  contract_status: string;
  contract_rate: string;
  contract_type: string;
  currency_cd: string;
  attachments: string;
}
