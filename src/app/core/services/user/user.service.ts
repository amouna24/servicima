import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { IUserInfo } from '@shared/models/userInfo.model';

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
  colorSubject$ = new Subject<string>();
  classSubject$ = new Subject<object>();
  haveImage$ = new Subject<string>();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingAction$ = this.isLoadingSubject.asObservable();
  avatar$ = new BehaviorSubject<any>(null);
  companyRolesFeatures = [];
  licenceFeature: string[];
  constructor(private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
  ) {
  }

  /**************************************************************************
   * @description get user info
   *************************************************************************/
  getUserInfo(): void {
    this.userCredentials = this.localStorageService.getItem('userCredentials');
    this.httpClient.get<IUserInfo>(`${environment.userGatewayApiUrl}` +
      `/getprofileinfos?application_id=${this.userCredentials['application_id']}&email_address=${this.userCredentials['email_address']}`)
      .subscribe( (data) => {
        this.userInfo = data;
        this.connectedUser$.next(data);
        this.getImage(data['user'][0].photo);
        const roleCode = data.userroles[0].userRolesKey.role_code;

        this.getCompanyRoleFeatures(this.getRoleCode(roleCode), this.userInfo['company'][0]['companyKey']['email_address'])
          .subscribe((list) => {
            this.companyRolesFeatures.push(( list as []).map(element => element['companyRoleFeaturesKey']['feature_code']));
            if (this.companyRolesFeatures.length > 1) {
              this.companyRolesFeatures.splice(0, this.companyRolesFeatures.length - 1);
            }
            this.licenceFeature =  data['licencefeatures'].map(element => element['LicenceFeaturesKey']['feature_code']);
            this.redirectUser(roleCode);
            this.isLoadingSubject.next(true);
          });
      });
  }
  /**************************************************************************
   * @description Redirect User to specific route and set SideNav items
   * @param userRole Role of connected User
   *************************************************************************/
  redirectUser(userRole: string): void {
    switch (userRole) {
      case 'ADMIN' || 'MANAGER' || 'HR-MANAGER' || 'SALES': {
        this.moduleName$.next('manager');
        this.router.navigate(['/manager']);
      }
        break;
      case 'COLLAB': {
        this.moduleName$.next('collaborator');
        this.router.navigate(['/collaborator']);
      }
        break;
      case 'CAND': {
        this.moduleName$.next('candidate');
        this.router.navigate(['/candidate']);
      }
        break;
    }
  }

  /**
   * @description : GET IMAGE FROM BACK AS BLOB
   *  create Object from blob and convert to url
   */
  getImage(idFile) {
    this.httpClient.get(`${environment.uploadFileApiUrl}/image/` + idFile, {
      responseType: 'blob',
    })
      .subscribe(
        data => {
          const unsafeImageUrl = URL.createObjectURL(data);
          this.avatar$.next(this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl));
        }, error => {
          console.log(error);
        });
  }

  /**************************************************************************
   * @description Emit color
   * @param color
   *************************************************************************/
  emitColor(color: string): void {
    this.colorSubject$.next(color);
  }

  /**************************************************************************
   * @description Emit class color
   * @param classColor class color
   *************************************************************************/
  emitClass(classColor: object): void {
    this.classSubject$.next(classColor);
  }

  /**************************************************************************
   * @description Emit message if image exist
   * @param message: string
   *************************************************************************/
  haveImage(message: string): void {
    this.haveImage$.next(message);
  }

  /**************************************************************************
   * @description get user role
   * @param applicationId: string
   * @param email: string
   *************************************************************************/
  getUserRole(applicationId: string, email: string) {
    return this.httpClient.get(`${environment.userRoleApiUrl}` + `?application_id=${applicationId}&email_address=${email}`);
  }
  /**************************************************************************
   * @description get company role features
   * @param role: string
   * @param email: string
   *************************************************************************/
  getCompanyRoleFeatures(role: string, email: string) {
    return this.httpClient.get(`${environment.companyRoleFeaturesApiUrl}` + `?role_code=${role}&email_address=${email}`);
  }
  /**
   * @description get role code
   */
  getRoleCode(role: string): string {
    switch (role) {
      case 'CAND':
        return 'CANDIDATE';
      case 'COLLAB':
        return 'COLLABORATOR';
      case 'ADMIN':
        return 'ADMIN';
      default:
        return;
    }
  }
}
