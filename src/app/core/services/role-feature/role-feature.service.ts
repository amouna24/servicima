import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRoleFeaturesModel } from '@shared/models/roleFeatures.model';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoleFeatureService {

  constructor(private httpClient: HttpClient, ) { }

  /**************************************************************************
   * @description add role feature
   * @param role: object to add
   * @returns message code
   *************************************************************************/
  addFeatureRole(role: object) {
    return this.httpClient
      .post(`${environment.companyRoleFeaturesApiUrl}`, role);
  }

  /**************************************************************************
   * @description add role feature
   * @param role: object to add
   * @returns message code
   *************************************************************************/
  addManyFeatureRole(role: object) {
    return this.httpClient
      .post(`${environment.companyRoleFeaturesApiUrl}/many`, role);
  }

  /**************************************************************************
   * @description add role feature
   * @param role: object to add
   * @returns message code
   *************************************************************************/
  deleteManyFeatureRole(role: object) {
    return this.httpClient
      .put(`${environment.companyRoleFeaturesApiUrl}/many`, role);
  }
  /**************************************************************************
   * @description get role feature
   * @param application: application
   * @param email: address email
   * @param role: role code
   * @param feature: feature code
   * @returns message code
   *************************************************************************/
  getRoleFeature(application: string, email: string, role: string, feature: string) {
    return this.httpClient
      .get<IRoleFeaturesModel[]>
      (`${environment.companyRoleFeaturesApiUrl}?application_id=${application}&email_address=${email}&role_code=${role}&feature_code=${feature}`);
  }

  /**************************************************************************
   * @description delete role feature
   * @param id: id role feature
   * @returns message code
   *************************************************************************/
  deleteFeatureRole(id: string) {
    return this.httpClient
      .delete(`${environment.companyRoleFeaturesApiUrl}?_id=${id}`);
  }
}
