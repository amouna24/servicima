import { IContractExtensionKey } from '@shared/models/contractExtensionKey.model';

export interface IContractExtension {
  /* ID */
  _id: string;
  contractorKey: IContractExtensionKey;
  extension_start_date?: string;
  extension_end_date?: string;
  extension_status?: string;
  extension_rate: string;
  extension_currency_cd?: string;
}
