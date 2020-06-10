import { IRefdatakeyModel } from './refdataKey.model';

export interface IRefdataModel {
  /* ID */
  _id: string;
  RefDataKey: IRefdatakeyModel;
  ref_data_desc: string;
  status: string;
}
