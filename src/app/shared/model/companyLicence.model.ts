import { CompanyLicenceKeyModel } from './companyLicenceKey.model';
export interface companyLicenceModel {
    CompanyLicenceKey: CompanyLicenceKeyModel;
    status: string;
    licence_start_date: string;
    licence_end_date: string;
    bill_periodicity: string;
}