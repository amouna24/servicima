import { Component, OnInit } from '@angular/core';
import { showMoreRule } from '@shared/animations/animations';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '@core/services/crypto/crypto.service';
import { TestService } from '@core/services/test/test.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { environment } from '@environment/environment';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-welcome-to-test',
  templateUrl: './welcome-to-test.component.html',
  styleUrls: ['./welcome-to-test.component.scss'],
  animations: [
    showMoreRule
  ]
})
export class WelcomeToTestComponent implements OnInit {
  queryList: any;
  isLoading = new BehaviorSubject<boolean>(false);
  emailAddress: string;
  hidden = true;
  applicationId: string;
  numberQuestion: number;
  totalTime: number;
  nameCompany: string;
  nameSession: string;
  expiredDate: Date;
  expiredDay: number;
  detailsCandidates: any;
  statusLink: string;
  animationState = 'open';
  photo: string;
  helpMenuOpen: string;
  env = environment.uploadFileApiUrl + '/show/';
  minimalScore: number;
  constructor(private route: ActivatedRoute,
              private cryptoService: CryptoService,
              private testService: TestService,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private router: Router,
              private utilsService: UtilsService,
  ) { }

  /**************************************************************************
   *  @description Loaded when component in init state
   *************************************************************************/
  ngOnInit(): void {
    this.isLoading.next(true);
    this.getDataFromLocalStorage();
    this.getConnectedUser();
    this.getQueryList();
    this.getTestInviteCandidate();
    this.getTotalQuestions();
    this.getSessionInfo();
    this.helpMenuOpen = 'out';
  }

  /**
   * @description Get Query list
   */
  getQueryList() {
    this.route.queryParams.subscribe(params => {
      const decryptQuery = this.cryptoService.decrypt( environment.cryptoKeyCode, decodeURIComponent(params.id).toString().replace(/ /g, '+'));
      const queryParamObject = { };
      const arrayOfCandidate = decryptQuery.split('&');
      arrayOfCandidate.map((candidate) => {
        const key = candidate.split('=')[0];
        queryParamObject[key] = candidate.split('=')[1];
      });
      this.queryList = queryParamObject;
    });
  }

  /**
   * @description Get Total Questions
   */
  getTotalQuestions() {
    this.testService
      .getSessionQuestion(`?company_email=${this.emailAddress}&application_id=${this.applicationId}&session_code=${this.queryList?.session_code}`)
      .subscribe((data) => {
        console.log('length', data);
      this.numberQuestion = data.length;
    });
  }

  /**
   * @description Get Session info
   */
  getSessionInfo() {
    this.testService
      .getSessionInfo(`?company_email=${this.emailAddress}&application_id=${this.applicationId}&session_code=${this.queryList?.session_code}`)
      .subscribe((data) => {
      this.minimalScore = data[0].minimal_score;
      this.totalTime = data[0]['test_session_time'] ;
      this.nameSession = data[0]['session_name'];
    });
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
            this.nameCompany = userInfo['company'][0].company_name;
            this.photo = userInfo['company'][0].photo;
          }
        });
  }

  /**
   * @description Get Test Invite Candidate
   */
  getTestInviteCandidate() {
    this.testService
      .getTestInviteCandidates(`?company_email=${this.emailAddress}&application_id=${this.applicationId}` +
        `&session_code=${this.queryList?.session_code}&candidate_email=${this.queryList?.candidate_email}`)
      .subscribe((data) => {
        this.expiredDay = data[0]['expired_date'];
        this.detailsCandidates = data[0];
        this.expiredDate = this.addDays(new Date(this.queryList['send_date']), this.expiredDay);
        this.isLoading.next(false);
        if (data[0].link_valid && this.calculateDiff(this.queryList['send_date']) < data[0]['expired_date']) {
         this.statusLink = 'link valid';
        } else if ( !data[0].link_valid ) {
          console.log('link invalid');
          this.statusLink = 'link valid';
        } else if (this.calculateDiff(this.queryList['send_date']) >= data[0]['expired_date']) {
          console.log('link expired');
          this.router.navigate(['/expired-code']);
        }
      }, error => {
        this.isLoading.next(false);
        console.error(error);
        this.router.navigate(['/notfound']);
      });
  }

  /**************************************************************************
   * @description get data from local storage
   *************************************************************************/
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
  }

  /**
   * @description Calculate difference day
   * @param dateSent: send date
   * @return difference day
   */
  calculateDiff(dateSent: Date) {
    const currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(),
        currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) )
      / (1000 * 60 * 60 * 24));
  }

  /**
   * @description Add days to date
   * @param date: date
   * @param days: number day to add
   * @return new date
   */
   addDays(date: Date, days: number) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  /**
   * @description Start test
   */
  startTest() {
    const inviteCandidateSend = {
      company_email: this.detailsCandidates['TestInviteCandidatesKey']['company_email'],
      application_id: this.detailsCandidates['TestInviteCandidatesKey']['application_id'],
      session_code: this.detailsCandidates['TestInviteCandidatesKey']['session_code'],
      candidate_email: this.detailsCandidates['TestInviteCandidatesKey']['candidate_email'],
      link_valid: false,
      expired_date: this.detailsCandidates['expired_date']
    };
      const queryObject = {
        sessionCode: this.detailsCandidates['TestInviteCandidatesKey']['session_code'],
        sessionName: this.nameSession,
        companyName: this.nameCompany,
        candidateEmail: this.queryList?.candidate_email,
        sendDate: this.queryList?.send_date,
        expiredDate: this.expiredDay
      };
      this.utilsService.navigateWithQueryParam('/candidate/test-management/qcm', queryObject);
  }

  /**
   * @description: open ar close more details
   */
  toggleRules(): void {
    this.helpMenuOpen = this.helpMenuOpen === 'out' ? 'in' : 'out';
    this.hidden = ! this.hidden;
  }

  /**
   * @description: back to home
   */
  backToHome(event: Event) {
    console.log(event, 'event');
   this.router.navigate(['/candidate']);
  }
}
