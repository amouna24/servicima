import { ISmsKeyModel } from '@shared/models/smsKey.model';

export interface ISmsModel {
    SendSmsKey?: ISmsKeyModel;
    sender_phone?: string;
    country_code_sender_phone ?: string;
    country_code_user?: string;
    user_phone ?: string;
    content?: string;
    status?: string;
}
