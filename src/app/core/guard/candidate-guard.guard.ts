import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TestService } from '@core/services/test/test.service';
import { UserService } from '@core/services/user/user.service';
import { environment } from '@environment/environment';
import { CryptoService } from '@core/services/crypto/crypto.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateGuardGuard implements CanActivate {
  emailAddress: string;
  applicationId: string;
  /**********************************************************************
   * Guard constructor
   *********************************************************************/
  constructor(private testService: TestService,
              private userService: UserService,
              private route: ActivatedRoute,
              private cryptoService: CryptoService,
              private localStorageService: LocalStorageService,
              private router: Router,
  ) {
    this.getDataFromLocalStorage();
    this.getConnectedUser();
  }

  /**************************************************************************
   * @description get data from local storage
   *************************************************************************/
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const decryptQuerySessionCode = this.cryptoService
      .decrypt( environment.cryptoKeyCode, decodeURIComponent(next.queryParams.sessionCode).toString().replace(/ /g, '+'));
    const decryptQueryCandidateMail = this.cryptoService
      .decrypt( environment.cryptoKeyCode, decodeURIComponent(next.queryParams.candidateEmail).toString().replace(/ /g, '+'));
    const decryptQuerySendDate = this.cryptoService
      .decrypt( environment.cryptoKeyCode, decodeURIComponent(next.queryParams.sendDate).toString().replace(/ /g, '+'));
    const cryptData = `?company_email=${this.emailAddress}&candidate_email=${decryptQueryCandidateMail}` +
      `&session_code=${decryptQuerySessionCode}&send_date=${decryptQuerySendDate}`;
    const idSessionCandidateLink = this.cryptoService.encrypt(environment.cryptoKeyCode, cryptData);
     this.testService.getTestInviteCandidates(  `?company_email=${this.emailAddress}&candidate_email=${decryptQueryCandidateMail}` +
       `&session_code=${decryptQuerySessionCode}&send_date=${decryptQuerySendDate}`).subscribe((data) => {
       if ( !data[0].link_valid ) {
         this.router.navigate(['/candidate/test-management/welcome-to-test'], { queryParams: { id: idSessionCandidateLink}});
       }
     });
    return true;
  }
}
