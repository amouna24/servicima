/* Angular core imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
/* RxJs imports */
import { Observable } from 'rxjs';
import { UserService } from '@core/services/user/user.service';

import { FingerPrintService } from '../../../../projects/auth-front-lib/src/lib/core/services/auth/fingerprint.service';

/* Specific imports */
import { LocalStorageService } from '../services/storage/local-storage.service';

/**********************************************************************
 * AuthGard : Used to allow or not access to the requested roots
 *********************************************************************/
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  data: any;

  /**********************************************************************
   * Guard constructor
   *********************************************************************/
  constructor(private fingerPrintService: FingerPrintService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private userService: UserService,
  ) {
  }

  /**********************************************************************
   * canActivate ; check if the user can access the requested route
   * -- if user already connected, check if the user status
   *    allow the user accessing requested route
   * -- if the user is not connected, try autologin using fingerprint
   * -- if the fingerprint signin failed, redirect to the login page
   *********************************************************************/
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve) => {

      /* Call the backend to check fingerprint is OK */
      this.fingerPrintService.userConnected()
        .then((result) => {

          /* Fingerprint is OK, new token and credentials status returned */
          if (result) {
            this.localStorageService.setItem('currentToken', { account_activation_token: this.fingerPrintService.token });

            /* credentials status PENDING, user should complete registration*/
            if (this.fingerPrintService.credentialsStatus === 'PENDING') {
              this.router.navigate(['/auth/complete-register'], { queryParams: { rg: this.fingerPrintService.registerCode } });
              resolve(false);
            } else { /* User Active => Allow access to requested ressource */
              this.userService.getUserInfo();
              if (this.userService.userInfo) {
                resolve(true);
              }
            }
          } else {
            /* Autologin cannot be done (fingerprint doesn't exist) => Redirect to login page */
            this.router.navigate(['/auth/login']);
            resolve(false);
          }
        });
    });
  }
}
