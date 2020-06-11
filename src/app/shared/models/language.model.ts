import { ILanguageKeyModel } from './languageKey.model';

export interface ILanguageModel {
  LanguageKey: ILanguageKeyModel;
  language_desc: string;
  status: string;
  _id: string;
}
