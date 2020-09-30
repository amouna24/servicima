/* Angular core imports */
import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
/* RxJs imports */
import { Observable } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
/*import { FingerPrintService } from '@widigital-group/auth-npm-front';*/

/* Specific imports */
import { LocalStorageService } from '../services/storage/local-storage.service';
import { FingerPrintService } from '../../../../projects/auth-front-lib/src/lib/core/services/auth/fingerprint.service';
import { AuthService } from '../../../../projects/auth-front-lib/src/lib/core/services/auth/auth.service';

/**********************************************************************
 * AuthGard : Used to allow or not access to the requested roots
 *********************************************************************/
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  data: any;
  isLoggedIn = false;
  resolveValue: boolean;
  /**********************************************************************
   * Guard constructor
   *********************************************************************/
  constructor(private fingerPrintService: FingerPrintService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private authS: AuthService,
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

      this.isLoggedIn = this.localStorageService.getItem('currentToken') != null;

      /* Call the backend to check fingerprint is OK */
      this.fingerPrintService.userConnected()
        .then((result) => {
          console.log('isLoggedIn', this.isLoggedIn);
          /* Fingerprint is OK, new token and credentials status returned */
          if (result) {
            this.localStorageService.setItem('currentToken', { account_activation_token: this.fingerPrintService.token });

            /* credentials status PENDING, user should complete registration*/
            if (this.fingerPrintService.credentialsStatus === 'PENDING') {
              this.router.navigate(['/auth/complete-register'], { queryParams: { rg: this.fingerPrintService.registerCode } });
              this.resolveValue = false;
            } else { /* User Active => Allow access to requested ressource */
              this.userService.getUserInfo();
              const isLogged =  this.userService.connectedUser$.subscribe(
                  (data) => {
                    if (!!data) {
                      this.redirectUser(data.userroles[0].userRolesKey.role_code);
                    }
                  });
              this.resolveValue = true;
            }
          } else {
            /* Autologin cannot be done (fingerprint doesn't exist) => Redirect to login page */
            this.router.navigate(['/auth/login']);
            this.isLoggedIn = false;
            this.resolveValue = false;
          }
        });
    return this.resolveValue;
  }

  redirectUser(userRole) {
    switch (userRole) {
      case 'ADMIN' || 'MANAGER' || 'HR-MANAGER' || 'SALES': {
          this.router.navigate(['/manager'] );
      }
      break;
      case 'COLLABORATOR': {
          this.router.navigate(['/collaborator']);
      }
      break;
      case 'CANDIDATE': {
          this.router.navigate(['/candidate']);
      }
      break;
      default:
        break;
    }
  }
}
