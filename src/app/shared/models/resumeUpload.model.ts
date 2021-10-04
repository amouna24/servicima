import { IResumeUploadKeyModel } from '@shared/models/resumeUploadKey.model';

export interface IResumeUploadModel {
  _id: string;
  ResumeUploadKey: IResumeUploadKeyModel;
  file_name: string;
  caption: string;

}
