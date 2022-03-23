import { ITrainingKey } from '@shared/models/trainingKey.model';

export interface ITraining {
   _id: string;
   TrainingKey: ITrainingKey;
   title: string;
   domain: string;
   warned_hours: number;
   start_date: string;
   end_date: string;
   price: number;
   description: string;
   online: boolean;
   status: string;
   organisation_code: string;
}
