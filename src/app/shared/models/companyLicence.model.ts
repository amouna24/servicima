import { ICompanyLicenceKeyModel } from './companyLicenceKey.model';
export interface ICompanyLicenceModel {
    CompanyLicenceKey: ICompanyLicenceKeyModel;
    status: string;
    licence_start_date: string;
    licence_end_date: string;
    bill_periodicity: string;
}
