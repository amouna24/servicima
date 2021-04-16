import { ILicenceFeatureKeyModel } from '@shared/models/licenceFeatureKey.model';

export interface ILicenceFeatureModel {
  LicenceFeaturesKey: ILicenceFeatureKeyModel;
  display: boolean;
  status: string;
}
