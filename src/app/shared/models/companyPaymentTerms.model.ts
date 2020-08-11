import { ICompanyPaymentTermsKeyModel } from '@shared/models/companyPaymentTermsKey.model';

export interface ICompanyPaymentTermsModel {
  companyPaymentTermsKey: ICompanyPaymentTermsKeyModel;
  /* Other fields */
  payment_terms_desc: string;
  delay: number;
  end_of_month_flag: string;
  status: string;
}
