import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserInfo } from '@shared/models/userInfo.model';

import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo: IUserInfo;
  userCredentials: string;
  connectedUser$ = new BehaviorSubject<IUserInfo>(null);
  constructor(private httpClient: HttpClient,
              private localStorageService: LocalStorageService, ) {
  }

   /**
    * @description get user info
    */
    getUserInfo(): void {
     this.userCredentials = this.localStorageService.getItem('userCredentials');
      this.httpClient.get<IUserInfo>(`${environment.userGatewayApiUrl}` +
       `/getprofileinfos?application_id=${this.userCredentials['application_id']}&email_address=${this.userCredentials['email_address']}`)
       .subscribe((data) => {
            this.userInfo = data;
            this.connectedUser$.next(data);
       });
      }

  /**
   * @description get user info
   * @param application: application
   * @param email: email
   */
  getUserInfoById(application: string, email: string): Observable<IUserInfo[]> {
   return  this.httpClient.get<IUserInfo[]>(`${environment.userGatewayApiUrl}/getprofileinfos?application_id=${application}&email_address=${email}`);
  }
}
