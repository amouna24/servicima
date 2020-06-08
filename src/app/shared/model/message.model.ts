import { MessageKeyModel } from './messageKey.model';
export interface MessageModel {

  MessageKey: MessageKeyModel;
  status: string ;
  message_content: string;
  company: string ;
  application: string;
  module: string ;
  language: string ;
}
