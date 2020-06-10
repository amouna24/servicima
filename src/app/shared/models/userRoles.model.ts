import { IUserRolesKeyModel } from './userRolesKey.model';
export interface IUserRolesModel {
    userRolesKey: IUserRolesKeyModel;
    granted_by: string;
    granted_date: string;

}
