import { ITrainingSessionWeekKey } from '@shared/models/trainingSessionWeekKey.model';

export interface ITrainingSessionWeek {
    TrainingSessionWeekKey: ITrainingSessionWeekKey;
    day: string;
    time: string;
    durration: string;
    status: string;
}
