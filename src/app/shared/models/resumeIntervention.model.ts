import { IResumeInterventionKeyModel } from '@shared/models/resumeInterventionKey.model';

export interface IResumeInterventionModel {
  _id: string;
  ResumeInterventionKey: IResumeInterventionKeyModel;
  level_of_intervention_desc: string;
  intervention_code: string;
  resume_code: string;
}
