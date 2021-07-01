import { IResumeSectionKeyModel } from '@shared/models/resumeSectionKey.model';

export interface IResumeSectionModel {
  _id: string;
  ResumeSectionKey: IResumeSectionKeyModel;
  section_title: string;
  section_desc: string;
  index: string;
  section_code: string;
  resume_code: string;
}
