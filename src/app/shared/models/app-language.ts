export interface IAppLanguage {
  _id: string;
  language_desc: string;
  status: string;
  LanguageKey: IAppLanguageKey;
}

export interface IAppLanguageKey {
  language_code: string;
}
