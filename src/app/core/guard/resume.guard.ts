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
    private utilsService: UtilsService,
    public translate: TranslateService,
  ) {
  }
  // @ts-ignore
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    this.translate.get('You must set your general information first').subscribe((message: string) => {
      this.message = message;
    });
    await this.resumeService.getResume(
      `?email_address=${this.userService.connectedUser$
        .getValue().user[0]['userKey']
        ['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        async (generalInfo) => {
          if (generalInfo['msg_code'] === '0004') {
            await this.router.navigate(['/candidate/resume']);
            this.utilsService.openSnackBar(this.message, 'close');
          }
        });
    return true;
  }
}
