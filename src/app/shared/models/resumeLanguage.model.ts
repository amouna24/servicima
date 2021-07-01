import { IResumeLanguageKeyModel } from '@shared/models/resumeLanguageKey.model';

export interface IResumeLanguageModel {
  _id: string;
  ResumeLanguageKey: IResumeLanguageKeyModel;
  level: string;
  resume_language_code: string;
  resume_code: string;
}
