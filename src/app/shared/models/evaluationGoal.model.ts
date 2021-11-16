import { IEvaluationGoalKey } from '@shared/models/evaluationGoalKey.model';

export interface IEvaluationGoal {
  /* ID */
  HREvaluationGoalsKey: IEvaluationGoalKey;
  _id: string;
  description: string;
  expected_result: string;
  deadline: string;

}
