import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IUserModel } from '@shared/models/user.model';
import { IUserInfo } from '@shared/models/userInfo.model';

import { environment } from 'src/environments/environment';

import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient,  private localStorageService: LocalStorageService) { }

 /**
  * @description get user
  * @param applicationId: appilcation id
  * @param emailAddress: email adress
  */
  getUser(applicationId: string, emailAddress: string): Observable<IUserInfo> {
    return this.httpClient
      .get<IUserInfo>(`${environment.userApiUrl}?application_id=${applicationId}&email_address=${emailAddress}`);
  }

  /**
   * @description: http request get to get the user by his id
   * @param id: string
   */
  getUserById(id: string) {
    return this.httpClient
      .get<IUserModel>(`${environment.userApiUrl}?_id=${id}`);
  }

  /**
   * @description: http request get to get all users registered in the same company
   * @param company_email: string
   */
  getAllUser(company_email: string): Observable<IUserModel[]> {
    return this.httpClient
      .get<IUserModel[]>(`${environment.userApiUrl}?company_email=${company_email}`);
  }

  /**
   * @description: http resquest put to update the information of user
   * @param user: user
   */
  updateUser(User): Observable<any> {
    return this.httpClient
      .put(environment.userApiUrl, User);
  }

  /**
   * @description: http request post to add a new user
   * @param user: user
   */
  addNewProfile(user) {
    return this.httpClient.post(environment.userApiUrl, user);
  }

  /**
   * @description: http request delete if wanna disable the status of the user
   *                http request put if wanna enable the status of the user
   * @param id: id user
   * @param status: status
   * @param updated_by: email user
   */
  userChangeStatus(id: string, status: string, updated_by: string) {
    if (status === 'ACTIVE') {
      return this.httpClient.delete(`${environment.userApiUrl}/disable?_id=${id}&updated_by=${updated_by}`);
    } else if (status === 'DISABLED') {
      return this.httpClient.put(`${environment.userApiUrl}/enable?_id=${id}&updated_by=${updated_by}`, null);

    }
  }
}
