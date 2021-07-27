import { IResumeProjectDetailsSectionKeyModel } from '@shared/models/resumeProjectDetailsSectionKey.model';

export interface IResumeProjectDetailsSectionModel {
  _id: string ;
  ResumeProjectDetailsSectionKey: IResumeProjectDetailsSectionKeyModel;
  project_details_section_desc: string;
  project_details_code: string;
  project_details_section_code: string;
}
