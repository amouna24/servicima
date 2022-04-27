import { ITrainingRequestKey } from '@shared/models/trainingRequestKey.model';

export interface ITrainingRequest {
    _id?: string;
    TrainingRequestKey?: ITrainingRequestKey;
    title?: string;
    organisation_code?: string;
    description?: string;
    status_request?: string;
    domain?: string;
    send_date?: Date;
    response_date?: Date;
    status?: string;
}
