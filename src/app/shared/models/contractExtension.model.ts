import { IContractExtensionKey } from '@shared/models/contractExtensionKey.model';

export interface IContractExtension {
  /* ID */
  _id: string;
  contractExtensionKey: IContractExtensionKey;
  extension_start_date?: string;
  extension_end_date?: string;
  extension_status?: string;
  extension_rate: string;
  extension_currency_cd?: string;
  attachments?: string;
}
