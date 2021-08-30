import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  NavigationEnd
} from '@angular/router';
import { ResumeService } from '@core/services/resume/resume.service';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResumeGuard implements CanActivate {
  message: string;
  /**********************************************************************
    * Guard constructor
    *********************************************************************/
  constructor(private resumeService: ResumeService,
    private router: Router,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private utilsService: UtilsService,
    public translate: TranslateService,
  ) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let i: boolean;
    this.spinnerService.isLoadingSubject.next(false);
    this.translate.get('You must set your general information first').subscribe((message: string) => {
      this.message = message;
    });
    console.log('performance.getEntriesByType(\'reload\') =', performance.getEntriesByType('reload'));
      this.router.events
        .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
        .subscribe(event => {
          i = event.id === 1 && event.url === event.urlAfterRedirects; });
          if (i) {
            return true;
          } else {
            return new Promise<boolean>(resolve => {
              console.log('loading');
              this.resumeService.getResume(
                `?email_address=${this.userService.connectedUser$
                  .getValue().user[0]['userKey']
                  ['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
                .subscribe(
                  async (generalInfo) => {
                    if (generalInfo['msg_code'] === '0004') {
                      console.log(generalInfo[0]);
                      await this.router.navigate(['/candidate/resume']);
                      this.utilsService.openSnackBar(this.message, 'close');
                      this.spinnerService.isLoadingSubject.next(false);
                      resolve(true);
                    } else {
                      console.log('gen info =', generalInfo[0]);
                      resolve(true);
                    }
                  });
            });
          }

}
}
