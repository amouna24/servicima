import { IInvoiceAttachmentKeyModel } from '@shared/models/invoiceAttachmentKey.model';

export interface IInvoiceAttachmentModel {
  InvoiceAttachmentKey: IInvoiceAttachmentKeyModel;
  file_title: string;
  size: string;
  date: string;
  attachment: string;
}
