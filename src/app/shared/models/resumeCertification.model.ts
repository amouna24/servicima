import { IResumeCertificationKeyModel } from '@shared/models/resumeCertificationKey.model';

export interface IResumeCertificationModel {
  _id: string;
  ResumeCertificationKey: IResumeCertificationKeyModel;
  name: string;
  organization: string;
  expire: boolean;
  date: string;
  expiring_date: string;
  certif_ref: string;
  certif_url: string;
  resume_code: string;
  certification_code: string;
}
