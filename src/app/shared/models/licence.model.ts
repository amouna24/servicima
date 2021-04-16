import { ILicenceKeyModel } from '@shared/models/licenceKey.model';

export interface ILicenceModel {
  LicenceKey: ILicenceKeyModel;
  free_user_nbr: number;
  level: number;
  licence_desc: string;
  licence_end_date: string;
  licence_start_date: string;
  annual_extra_user_price: number;
  monthly_extra_user_price: number;
  pack_annual_price: number;
  pack_monthly_price: number;
  price_currency_id: string;
  trial_days: string;
}
