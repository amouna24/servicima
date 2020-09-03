import { ITaxKeyModel } from '@shared/models/taxKey.model';

export interface ITaxModel {
  TaxKey: ITaxKeyModel;
  _id: string;
  tax_desc: string;
  tax_rate: number;
  tax_inactive_date: Date;
  tax_comment: string;
}
