import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IUserModel } from '@shared/models/user.model';

import { IUserRolesModel } from '@shared/models/userRoles.model';
import { IMessageCodeModel } from '@shared/models/messageCode.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }

  /**
   * @description: http request get to get the user by his id
   * @param id: string
   */
  getUserById(id: string): Observable<IUserModel> {
    return this.httpClient
      .get<IUserModel>(`${environment.userApiUrl}?_id=${id}`);
  }

  /**
   * @description: http request get to get all users registered in the same company
   * @param company_email: string
   */
  getAllUser(companyEmail: string): Observable<IUserModel[]> {
    return this.httpClient
      .get<IUserModel[]>(`${environment.userApiUrl}?company_email=${companyEmail}`);
  }
  /**
   * @description: http request put to update the information of user
   * @param user: user
   */
  updateUser(user: object): Observable<IUserModel> {
    return this.httpClient
      .put<IUserModel>(environment.userApiUrl, user);
  }

  /**
   * @description: http request post to add a new user
   * @param user: user
   */
  UpdateUserRole(user: object): Observable<IUserRolesModel> {
    return this.httpClient.put<IUserRolesModel>(`${environment.userRoleApiUrl}`, user);
  }
  /**
   * @description: http request post to add a new user
   * @param user: user
   */
  addNewProfile(user: object): Observable<IMessageCodeModel> {
    return this.httpClient.post<IMessageCodeModel>(`${environment.userGatewayApiUrl}/addprofile`, user);
  }

  /**
   * @description: http request delete if wanna disable the status of the user
   *               http request put if wanna enable the status of the user
   * @param id: id user
   * @param status: status
   * @param updated_by: email user
   */
  userChangeStatus(id: string, status: string, updatedBy: string): Observable<IMessageCodeModel> {
    if (status === 'ACTIVE') {
      return this.httpClient.delete<IMessageCodeModel>(`${environment.userApiUrl}/disable?_id=${id}&updated_by=${updatedBy}`);
    } else if (status === 'DISABLED') {
      return this.httpClient.put<IMessageCodeModel>(`${environment.userApiUrl}/enable?_id=${id}&updated_by=${updatedBy}`, null);
    }
  }

  /**
   * @description update company credentials
   * @param company: company object to update
   */
  updateCompany(company: object): Observable<IMessageCodeModel>  {
    return this.httpClient
      .put<IMessageCodeModel>(environment.companyApiUrl, company);
  }

  /**
   * @description change password
   * @param user: object
   */
  changePassword(user: object): Observable<IMessageCodeModel> {
    return this.httpClient
      .put<IMessageCodeModel>(`${environment.credentialsApiUrl}/updatepassword` , user);
  }
}
