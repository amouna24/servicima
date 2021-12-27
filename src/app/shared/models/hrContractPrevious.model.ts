import { IHrContractPreviousKey } from '@shared/models/hrContractPreviousKey.model';

export interface IHrPreviousContract {
  /* ID */
   HRContractPreviousKey: IHrContractPreviousKey;
  _id: string;
  companyName: string;
  contract_start_date: string;
  contract_end_date: string;
  contract_date: string;
  contract_status: string;
  contract_rate: string;
  contract_type: string;
  currency_cd: string;
  title_cd: string;
  country_code: string;
}
