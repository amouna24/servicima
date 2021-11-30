import { IResumeListKeyModel } from '@shared/models/resumeListKey.model';

export interface IResumeListModel {
  ResumeListKey: IResumeListKeyModel;
  file_name: string;
  caption: string;
}
