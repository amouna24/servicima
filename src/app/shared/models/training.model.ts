import { ITrainingKey } from '@shared/models/trainingKey.model';

export interface ITraining {
   _id?: string;
   TrainingKey?: ITrainingKey;
   title?: string;
   domain?: string;
   warned_hours?: number;
   warned_number?: number;
   start_date?: Date;
   end_date?: Date;
   price?: number;
   description?: string;
   online?: boolean;
   status?: string;
   organisation_code?: string;
}
