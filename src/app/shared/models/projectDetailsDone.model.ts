import { IResumeProjectDetailsKeyModel } from '@shared/models/resumeProjectDetailsKey.model';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';

export interface IResumeProjectDetailsDoneModel {
  _id: string;
  ResumeProjectDetailsKey: IResumeProjectDetailsKeyModel;
  project_detail_title: string;
  project_detail_desc: string;
  project_details_code: string;
  project_code: string;
  projectDetailsSection: IResumeProjectDetailsSectionModel[];
}
