import { IIdentityDocumentKey } from '@shared/models/identityDocumentKey.model';

export interface IIdentityDocument {
  /* ID */
  HRIdentityDocumentKey?: IIdentityDocumentKey;
  _id: string;
  file?: string;
  type?: string;
  validity_date?: string;
}
