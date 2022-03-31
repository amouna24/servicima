import { ITrainingSessionWeekKey } from '@shared/models/trainingSessionWeekKey.model';

export interface ITrainingSessionWeek {
    _id?: string;
    TrainingSessionWeekKey?: ITrainingSessionWeekKey;
    day?: string;
    time?: string;
    durration?: string;
    status?: string;
}
