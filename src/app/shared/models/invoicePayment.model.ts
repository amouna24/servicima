import { IInvoicePaymentKeyModel } from '@shared/models/invoicePaymentKey.model';

export interface IInvoicePaymentModel {
  InvoicePaymentKey: IInvoicePaymentKeyModel;
  bank_account: string;
  payment_mode: string;
  invoice_line_unit_amount: string;
  note: string;
  entered_by: string;
}
