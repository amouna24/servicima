import { UserModel } from './user.model'
import { UserRolesModel } from './userRoles.model';
import { CredentialsModel } from './Credentials.model';
import { CompanyModel } from './company.model';
import { StaffModel } from './staff.model';
export class UserInfo {
    user: UserModel[];
    userroles: UserRolesModel[];
    credentials : CredentialsModel[];
    licencefeature: {};
    company : CompanyModel;
    companyLicence: any[]; 
    companyrolesfeatures:{};
    staff : StaffModel[];
    collaborator: any[];
    candidate: any[];
  }
  