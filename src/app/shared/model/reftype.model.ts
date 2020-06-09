import { IRefTypeKeyModel } from './refTypeKey.model';

export interface IReftypeModel {
  _id: string;
  RefTypeKey: IRefTypeKeyModel;
  ref_type_desc: string;
  status: string;

}
