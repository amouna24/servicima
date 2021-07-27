import { IResumeCertificationDiplomaKeyModel } from '@shared/models/resumeCertificationDiplomaKey.model';

export interface IResumeCertificationDiplomaModel {
  _id: string;
  ResumeCertificationDiplomaKey: IResumeCertificationDiplomaKeyModel;
  establishment: string;
  diploma: string;
  start_date: string;
  end_date: string;
  certif_diploma_desc: string;
  resume_code: string;
  certif_diploma_code: string;
}
