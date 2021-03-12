import { ILicenceFeatureKeyModel } from '@shared/models/licenceFeatureKey.model';

export interface ILicenceFeatureModel {
  LicenceFeaturesKey: ILicenceFeatureKeyModel;
  status: string;
}
