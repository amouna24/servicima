import { IPaymentTermsKeyModel } from '@shared/models/paymentTermsKey.model';

export interface IPaymentTermsModel {
  PaymentTermsKey: IPaymentTermsKeyModel;
  payment_terms_desc: string;
  delay: number;
  end_of_month_flag: string;
  status: string;
}
