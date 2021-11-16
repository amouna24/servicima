import { IBankingKey } from '@shared/models/bankingKey.model';

export interface IBanking {
  /* ID */
  HRBankingKey?: IBankingKey;
  _id: string;
  bank_name?: string;
  iban?: string;
  rib?: string;

}
