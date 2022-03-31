import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '@environment/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
import { CryptoService } from '@core/services/crypto/crypto.service';
import { TestService } from '@core/services/test/test.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wid-choose-candidates',
  templateUrl: './choose-candidates.component.html',
  styleUrls: ['./choose-candidates.component.scss']
})
export class ChooseCandidatesComponent implements OnInit {
  tableColumns = [
    { nameColumn: 'fullName', photo: 'photo'},
    { nameColumn: 'email_address', iconColumn: 'email'},
    { nameColumn: 'prof_phone', iconColumn: 'wi-phone'}];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  env: string;
  applicationId: string;
  companyEmailAddress: string;
  displayIcon: boolean;
  expiredDay = 7;
  label: any;
  listCodeTranslate = ['sendmail.invitecandidate.hello',
                       'sendmail.invitecandidate.attention',
                       'sendmail.invitecandidate.evaltechnique',
                       'sendmail.invitecandidate.passtest',
                       'sendmail.invitecandidate.session',
                       'sendmail.invitecandidate.luck',
                       'sendmail.invitecandidate.Cordially',
                       'sendmail.invitecandidate.subject'];

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
                private localStorageService: LocalStorageService,
                private utilsService: UtilsService,
                private cryptoService: CryptoService,
                private userService: UserService,
                private testService: TestService,
                private translate: TranslateService,
                private dialogRef: MatDialogRef<ChooseCandidatesComponent>
             ) {
   this.env = environment.uploadFileApiUrl + '/show/';
    this.displayIcon = true;
  }

  /**************************************************************************
   *  @description Get translate
   *************************************************************************/
    getTranslate() {
      this.translate.get(this.listCodeTranslate).subscribe((data: string) => {
        this.label = data;
      });
    }

  /**************************************************************************
   *  @description Loaded when component in init state
   *************************************************************************/
  ngOnInit(): void {
    this.getConnectedUser();
    this.getDataFromLocalStorage();
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];          }
        });
  }

  /**
   * @description Get local storage
   */
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
  }

  /**
   * @description send mail
   */
  sendMail(event) {
    if (!event || !this.expiredDay) {
      console.log('form invalid');
    } else {
      this.getTranslate();
      event.map((candidate) => {
      const cryptData = `?company_email=${candidate.company_email}&candidate_email=${candidate.userKey.email_address}` +
        `&session_code=${this.data.sessionCode}&send_date=${new Date()}`;
      const idSessionCandidateLink = this.cryptoService.encrypt(environment.cryptoKeyCode, cryptData);
      const link = `${environment.servicimaUrl}/candidate/test-management/welcome-to-test/?id=${decodeURIComponent(idSessionCandidateLink)}`;
      const header = `${this.label['sendmail.invitecandidate.hello']} ` + candidate.fullName + ' ,';
      const text1 = `${this.label['sendmail.invitecandidate.attention']} `;
      const text2 = `${this.label['sendmail.invitecandidate.evaltechnique']} `;
      const text3 = `${this.label['sendmail.invitecandidate.passtest']} `;
      const text4 =  `${this.label['sendmail.invitecandidate.session']} `;
      const text6 = `${this.label['sendmail.invitecandidate.luck']} `;
      const text7 = `${this.label['sendmail.invitecandidate.Cordially']} `;

      const  text = header.trim() + '\n' + '\n' +  text1.trim() + '\n'  + '\n'  +
        text2.trim() + '\n'  +  text3.trim() + '\n' + '\n' + text4.trim() +
        '\n' + link  + '\n' + '\n' +  text6.trim()  + '\n' + '\n' + text7.trim();

      const inviteCandidateSend = {
        company_email: this.companyEmailAddress,
        application_id: this.applicationId,
        session_code: this.data.sessionCode,
        candidate_email: candidate.userKey.email_address,
        expired_date: this.expiredDay
      };
      this.testService.addTestInviteCandidates(inviteCandidateSend).subscribe((data) => {
        this.userService
          .sendMail(
            {
              receiver: {
                name: '',
                email: 'khmayesbounguicha@gmail.com'
              },
              sender: {
                application: '',
                name: 'No Reply',
                email: candidate.email_address
              },
              modelCode: {
                applicationName: '',
                language_id: this.localStorageService.getItem('language').langId,
                application_id: this.utilsService.getApplicationID('SERVICIMA'),
                company_id: this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
              },
              text,
              subject: this.label['sendmail.invitecandidate.subject'],
              attachement: [],
              emailcc: '',
              emailbcc: '',
            }
          ).subscribe((dataB) => {
           console.log('email resended');
          this.dialogRef.close();
        }, error => {
          console.log(error);
        });
      }, error => {
        if (error.error.msg_code === '0001') {
          console.error('candidate already invited');
        } else {
          console.error(error);
        }
      });

    });
    }
  }

  /**
   * @description cancel
   */
  cancel() {
   this.dialogRef.close(false);
  }

}
