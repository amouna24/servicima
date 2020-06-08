import { RefdatakeyModel } from './refdataKey.model';

export interface RefdataModel {
  /* ID */
  _id: string;
  RefDataKey: RefdatakeyModel;
  ref_data_desc: string;
  status: string;
}
