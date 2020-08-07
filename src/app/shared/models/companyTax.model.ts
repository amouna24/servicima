import { ICompanyTaxKeyModel } from '@shared/models/companyTaxKey.model';

export interface ICompanyTaxModel {

  /* Unique Key */
  companyTaxKey: ICompanyTaxKeyModel;

  /* Other fields */
  tax_desc: string;
  tax_rate: number;
  tax_inactive_date: Date;
  tax_comment: string;

}
