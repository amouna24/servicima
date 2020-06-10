import { ICompanyModel } from './company.model';
import { ICredentialsModel } from './credentials.model';
import { IStaffModel } from './staff.model';
import { IUserModel } from './user.model';
import { IUserRolesModel } from './userRoles.model';
export interface IUserInfo {
    user: IUserModel[];
    userroles: IUserRolesModel[];
    credentials: ICredentialsModel[];
    licencefeature: { };
    company: ICompanyModel;
    companyLicence: any[];
    companyrolesfeatures: { };
    staff: IStaffModel[];
    collaborator: any[];
    candidate: any[];
  }
