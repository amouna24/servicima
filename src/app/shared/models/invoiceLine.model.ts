import { IInvoiceLineKeyModel } from '@shared/models/invoiceLineKey.model';

export interface IInvoiceLineModel {
  InvoiceLineKey: IInvoiceLineKeyModel;
  project_code: string;
  project_desc: string;
  invoice_line_unit_amount: number;
  days_nbr: number;
  vat_rate: number;
  vat_amount: number;
  discount: number;
  invoice_line_total_amount: number;
  comment1: string;
  comment2: string;
}
