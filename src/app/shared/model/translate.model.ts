import { TranslateKeyModel } from './translateKey.model';

export interface TranslateModel {

  TranslateKey: TranslateKeyModel;
  status: string ;
  translate_content: string;
  company : string ;
  application : string;
  module : string ;
  language: string ;
}
