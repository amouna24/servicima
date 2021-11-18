/* Angular core imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
/* RxJs imports */
import { UserService } from '@core/services/user/user.service';
import { AuthService, FingerPrintService } from '@widigital-group/auth-npm-front';
import { UtilsService } from '@core/services/utils/utils.service';

/* Specific imports */
import { LocalStorageService } from '../services/storage/local-storage.service';
// import { FingerPrintService, AuthService } from '../../../../projects/auth-front-lib/src/public-api';

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
  userCredentials: string;
  emailAddress: string;
  applicationId: string;
  i = 0;
  currentState: string;
  /**********************************************************************
   * Guard constructor
   *********************************************************************/
  constructor(private fingerPrintService: FingerPrintService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private authService: AuthService,
              private utilService: UtilsService,
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
        this.currentState = state.url;
    /* Call the backend to check fingerprint is OK */
    if (state.root.queryParams.rg && state.root.queryParams.auto === 'yes') {
      return new Promise<boolean>(resolve =>
         this.authService.getAuthRegisterCode(state.root.queryParams.rg, 'AUTH-MODULE').subscribe( (res) => {
          if (res) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
           () => {
             this.router.navigate(['/auth/login']);
             resolve(false);
           }));
    } else {
      this.fingerPrintService.userConnected( this.localStorageService.getItem('email_adress'))
        .then(async (result) => {
          /* Fingerprint is OK, new token and credentials status returned */
          if (result) {
            this.localStorageService.setItem('currentToken', { account_activation_token: this.fingerPrintService.token});
            this.userCredentials = this.localStorageService.getItem('userCredentials');
            if (this.userCredentials) {
              this.emailAddress = this.userCredentials['email_address'];
              this.applicationId = this.userCredentials['application_id'];
            }
            /* credentials status PENDING, user should complete registration*/
            if (this.fingerPrintService.credentialsStatus === 'PENDING' && this.emailAddress && this.applicationId) {
              this.router.navigate(['/auth/complete-register'], { queryParams: { rg: this.fingerPrintService.registerCode}});
              this.resolveValue = true;
             } else if (this.emailAddress && this.applicationId) { /* User Active => Allow access to requested ressource */
              if (! this.userService.userInfo || (this.userService.refresh && this.userService.userInfo))  {
                this.userService.getUserInfo().then((data) => {
                  if (data) {
                    this.userService.redirectUser(data['user'][0].user_type, this.currentState);
                    this.utilService.getCompanies(data['company'][0]['companyKey']['email_address']);
                    this.userService.getRoleFeature(data, data.userroles[0].userRolesKey.role_code);
                    this.resolveValue = true;
                  }

                });
           }
            } else {
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

}
