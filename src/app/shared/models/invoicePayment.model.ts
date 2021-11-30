import { IInvoicePaymentKeyModel } from '@shared/models/invoicePaymentKey.model';

export interface IInvoicePaymentModel {
  InvoicePaymentKey: IInvoicePaymentKeyModel;
  bank_account: string;
  payment_mode: string;
  invoice_line_unit_amount: string;
  payment_mode_desc: string;
  note: string;
  entered_by: string;
  disabled: boolean;
}
