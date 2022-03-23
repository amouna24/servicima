import { ITrainingRequestKey } from '@shared/models/trainingRequestKey.model';

export interface ITrainingRequest {
    TrainingRequestKey: ITrainingRequestKey;
    title: string;
    organisation_code: string;
    description: string;
    status_request: string;
    status: string;
}
