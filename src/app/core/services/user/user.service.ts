import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserInfo } from '@shared/models/userInfo.model';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '@core/services/spinner/spinner.service';

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
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingAction$ = this.isLoadingSubject.asObservable();
  avatar$ = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient,
              private router: Router,
              private localStorageService: LocalStorageService,
              private sanitizer: DomSanitizer,
              ) {
  }

  /**************************************************************************
   * @description get user info
   *************************************************************************/
    getUserInfo() {
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
                this.redirectUser(data.userroles[0].userRolesKey.role_code);
           });
  }
  /**************************************************************************
   * @description Redirect User to specific route and set SideNav items
   * @param userRole Role of connected User
   *************************************************************************/
  redirectUser(userRole) {
    switch (userRole) {
      case 'ADMIN' || 'MANAGER' || 'HR-MANAGER' || 'SALES': {
        this.moduleName$.next('manager');
        this.router.navigate(['/manager'] ).then(
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
      case 'COLLABORATOR': {
        this.moduleName$.next('collaborator');
        this.router.navigate(['/collaborator']);
        this.isLoadingSubject.next(false);
      }
      break;
      case 'CANDIDATE': {
        this.moduleName$.next('candidate');
        this.router.navigate(['/candidate']);
        this.isLoadingSubject.next(false);
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
  emitCass(classColor: object): void {
    this.classSubject$.next(classColor);
  }
}
