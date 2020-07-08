import { ILicenceKeyModel } from '@shared/models/licenceKey.model';

export interface ILicenceModel {
  LicenceKey: ILicenceKeyModel;
  annual_extra_user_price: string;
  free_user_nbr: string;
  level: string;
  licence_desc: string;
  licence_end_date: string;
  licence_start_date: string;
  monthly_extra_user_price: string;
  pack_annual_price: string;
  pack_monthly_price: string;
  price_currency_id: string;
  trial_days: string;
}
