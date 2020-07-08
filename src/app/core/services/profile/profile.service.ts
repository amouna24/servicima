import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IUserModel } from '@shared/models/user.model';

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
  getUserById(id: string): Observable<any> {
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
  updateUser(user: object): Observable<any> {
    return this.httpClient
      .put(environment.userApiUrl, user);
  }

  /**
   * @description: http request post to add a new user
   * @param user: user
   */
  UpdateUserRole(user: object): Observable<any> {
    return this.httpClient.put(`${environment.userRoleApiUrl}`, user);
  }
  /**
   * @description: http request post to add a new user
   * @param user: user
   */
  addNewProfile(user: object): Observable<any> {
    return this.httpClient.post(`${environment.userGatewayApiUrl}/addprofile`, user);
  }

  /**
   * @description: http request delete if wanna disable the status of the user
   *               http request put if wanna enable the status of the user
   * @param id: id user
   * @param status: status
   * @param updated_by: email user
   */
  userChangeStatus(id: string, status: string, updatedBy: string) {
    if (status === 'ACTIVE') {
      return this.httpClient.delete(`${environment.userApiUrl}/disable?_id=${id}&updated_by=${updatedBy}`);
    } else if (status === 'DISABLED') {
      return this.httpClient.put(`${environment.userApiUrl}/enable?_id=${id}&updated_by=${updatedBy}`, null);
    }
  }

  /**
   * @description update company credentials
   * @param company: company object to update
   */
  updateCompany(company: object): Observable<any> {
    return this.httpClient
      .put(environment.companyApiUrl, company);
  }
}
