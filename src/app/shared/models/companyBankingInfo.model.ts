import { ICompanyBankingInfoModelKey } from '@shared/models/companyBankingInfoKey.model';
export interface ICompanyBankingInfoModel {
  _id: string;
  companyBankingInfoKey: ICompanyBankingInfoModelKey;
  bank_address: string;
  bic_code: string;
  iban: string;
  rib: string;
  factor_informations: string;
  bank_name: string;
  bank_domiciliation: string;
}
