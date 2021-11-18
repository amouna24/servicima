import { IChildKey } from '@shared/models/childKey.model';

export interface IChild {
  /* ID */
  HRChildKey?: IChildKey;
  _id: string;
  full_name: string;
  birth_date: string;
}
