import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  listFeatureRole = [];
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
      .pipe(
        tap(() => this.isLoadingSubject.next(true)),
      )
      .subscribe(async (data) => {
        this.userInfo = data;
        this.connectedUser$.next(data);
        this.getImage(data['user'][0].photo);
        const roleCode = data.userroles[0].userRolesKey.role_code;
        this.getCompanyRoleFeatures(this.getRoleCode(roleCode), this.userInfo['company'][0]['companyKey']['email_address'])
          .subscribe((list) => {
            this.listFeatureRole[0] = list;
            this.redirectUser(roleCode);
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
        this.router.navigate(['/manager']).then(
          (res) => {
            if (res == null) {
              this.isLoadingSubject.next(true);
            } else if (res === true) {
              this.isLoadingSubject.next(true);
            }
          }
        );
      }
        break;
      case 'COLLAB': {
        this.moduleName$.next('collaborator');
        this.router.navigate(['/collaborator']).then(
          (res) => {
            if (res == null) {
              this.isLoadingSubject.next(true);
            } else if (res === true) {
              this.isLoadingSubject.next(true);
            }
          }
        );
      }
        break;
      case 'CAND': {
        this.moduleName$.next('candidate');
        this.router.navigate(['/candidate']).then(
          (res) => {
            if (res == null) {
              this.isLoadingSubject.next(true);
            } else if (res === true) {
              this.isLoadingSubject.next(true);
            }
          }
        );
      }
        break;
      default:
        this.isLoadingSubject.next(false);
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
   * @param object class color
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
   * @param message: string
   *************************************************************************/
  getUserRole(applicatinId: string, email: string) {
    return this.httpClient.get(`${environment.userRoleApiUrl}` + `?application_id=${applicatinId}&email_address=${email}`);
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
        break;
      case 'COLLAB':
        return 'COLLABORATOR';
        break;
      case 'ADMIN':
        return 'ADMIN';
        break;
      default:
        return;
    }
  }
}
