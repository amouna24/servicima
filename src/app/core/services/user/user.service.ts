import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserInfo } from '@shared/models/userInfo.model';
import { Router } from '@angular/router';

import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo: IUserInfo;
  userCredentials: string;
  moduleName$ = new BehaviorSubject<string>(null);
  connectedUser$ = new BehaviorSubject<IUserInfo>(null);
  redirected = false;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private localStorageService: LocalStorageService, ) {
  }

  /**************************************************************************
   * @description get user info
   *************************************************************************/
    async getUserInfo(): Promise<boolean> {
          this.userCredentials = this.localStorageService.getItem('userCredentials');
          await this.httpClient.get<IUserInfo>(`${environment.userGatewayApiUrl}` +
           `/getprofileinfos?application_id=${this.userCredentials['application_id']}&email_address=${this.userCredentials['email_address']}`)
           .subscribe(async (data) => {
                this.userInfo = data;
                this.connectedUser$.next(data);
                this.redirected = await this.redirectUser(data.userroles[0].userRolesKey.role_code);
           });
      return this.redirected;
  }
  /**************************************************************************
   * @description Redirect User to specific route and set SideNav items
   * @param userRole Role of connected User
   *************************************************************************/
  async redirectUser(userRole): Promise<boolean> {
    switch (userRole) {
      case 'ADMIN' || 'MANAGER' || 'HR-MANAGER' || 'SALES': {
        this.moduleName$.next('manager');
        this.router.navigate(['/manager'] );
        return true;
      }
      case 'COLLABORATOR': {
        this.moduleName$.next('collaborator');
        this.router.navigate(['/collaborator']);
        return true;
      }
      case 'CANDIDATE': {
        this.moduleName$.next('candidate');
        this.router.navigate(['/candidate']);
        return;
      }
      default:
        return false;
    }
  }
}
