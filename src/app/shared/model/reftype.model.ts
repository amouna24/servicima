import { RefTypeKeyModel } from './refTypeKey.model';

export interface ReftypeModel {
  _id: string;
  RefTypeKey: RefTypeKeyModel;
  ref_type_desc: string;
  status: string;

}
