import { IEvaluationKey } from '@shared/models/evaluationKey.model';

export interface IEvaluation {
  /* ID */
  HREvaluationKey: IEvaluationKey;
  _id: string;
  main_mission: string;
  evaluation_start_date: string;
  evaluation_end_date: string;
  report?: string;
  evaluation_doc?: string;
}
