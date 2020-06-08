import { UserRolesKeyModel } from './userRolesKey.model';
export interface UserRolesModel {
    userRolesKey: UserRolesKeyModel;
    granted_by: string;
    granted_date: string;

}