import { IFeatureKeyModel } from '@shared/models/featureKey.model';

export interface IFeatureModel {
  FeatureKey: IFeatureKeyModel;
  feature_desc: string;
  status: string;
}
