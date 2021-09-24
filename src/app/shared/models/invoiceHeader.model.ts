import { IInvoiceHeaderKeyModel } from '@shared/models/invoiceHeaderKey.model';

export interface IInvoiceHeaderModel {
  InvoiceHeaderKey: IInvoiceHeaderKeyModel;
  invoice_status: string;
  factor_involved: string;
  invoice_date: string;
  invoice_delay: string;
  contractor_code: string;
  contract_code: string;
  invoice_amount: string;
  vat_amount: string;
  invoice_total_amount: string;
  invoice_currency: string;
  attachment: string;
  comment1: string;
  comment2: string;
  password: string;
}
