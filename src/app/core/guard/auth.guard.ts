/* Angular core imports */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate, CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
/* RxJs imports */
import { UserService } from '@core/services/user/user.service';
import { FingerPrintService } from '@widigital-group/auth-npm-front';

/* Specific imports */
import { LocalStorageService } from '../services/storage/local-storage.service';
// import { FingerPrintService } from '../../../../projects/auth-front-lib/src/lib/core/services/auth/fingerprint.service';

/**********************************************************************
 * AuthGard : Used to allow or not access to the requested roots
 *********************************************************************/
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  /**********************************************************************
   * @description IsLoggedIn to check if user's connected
   * resolveValue: the result returned for each steps (true/false)
   *********************************************************************/
  resolveValue: boolean;
  userCredentials;
  emailAddress = '';
  applicationId = '';
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
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      /* Call the backend to check fingerprint is OK */
      this.fingerPrintService.userConnected()
        .then(async (result) => {
          /* Fingerprint is OK, new token and credentials status returned */
          if (result) {
            this.localStorageService.setItem('currentToken', { account_activation_token: this.fingerPrintService.token});
           if(this.userCredentials = this.localStorageService.getItem('userCredentials')){
            this.emailAddress = this.userCredentials['email_address']
            this.applicationId = this.userCredentials['application_id']
          }
            /* credentials status PENDING, user should complete registration*/
            if (this.fingerPrintService.credentialsStatus === 'PENDING' && this.emailAddress && this.applicationId  ) {
              this.router.navigate(['/auth/complete-register'], { queryParams: { rg: this.fingerPrintService.registerCode}});
              this.resolveValue = true;
            } else if(this.emailAddress && this.applicationId){ /* User Active => Allow access to requested ressource */
              this.resolveValue = await this.userService.getUserInfo();
            }
            else {
              this.router.navigate(['/auth/login']);
              this.resolveValue = true;
            }
          } else {
            /* Autologin cannot be done (fingerprint doesn't exist) => Redirect to login page */
            this.router.navigate(['/auth/login']);
            this.resolveValue = true;
          }
    });
      return this.resolveValue;
  }

}
