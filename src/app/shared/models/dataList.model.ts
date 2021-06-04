import { IDataListKey } from '@shared/models/dataListKey.model';

export interface IDataListModel {
  dataListKey: IDataListKey;
  column_desc: string;
  colum_disp_index: number;
  can_be_displayed: string;
  displayed: string;
  can_be_filtred: string;
  type: string;
}
