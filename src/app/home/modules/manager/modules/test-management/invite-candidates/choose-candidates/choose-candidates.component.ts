import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '@environment/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
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
  tableColumnsInvoiceAttachment: string[] = ['select', 'Full Name', 'email', 'phone'];
  dataSourceInvoiceAttachment: MatTableDataSource<any> = new MatTableDataSource([]);
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
                       'sendmail.invitecandidate.Cordially'];
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

    getTranslate() {
      this.translate.get(this.listCodeTranslate).subscribe((data: string) => {
        console.log(data, 'data');
        this.label = data;
      });
    }

  /**************************************************************************
   *  @description Loaded when component in init state
   *************************************************************************/
  ngOnInit(): void {
    this.dataSourceInvoiceAttachment = new MatTableDataSource(
      this.data.listCandidates
    );
    this.getConnectedUser();
    this.getDataFromLocalStorage();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceInvoiceAttachment.data.forEach(row => this.selection.select(row));
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceInvoiceAttachment.data.length;
    return numSelected === numRows;
  }

  /**
   * @description Get local storage
   */
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
  }

  /**
   * @description search field
   */
  searchField(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInvoiceAttachment.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description send mail
   */
  sendMail() {
    if (!this.selection['_selected'] || !this.expiredDay) {
      console.log('form invalid');
    } else {
      this.getTranslate();
    this.selection['_selected'].map((candidat) => {
      const cryptData = `?company_email=${candidat.company_email}&candidate_email=${candidat.userKey.email_address}` +
        `&session_code=${this.data.sessionCode}&send_date=${new Date()}`;
      const idSessionCandidateLink = this.cryptoService.encrypt(environment.cryptoKeyCode, cryptData);
      const link = `${environment.servicimaUrl}/candidate/test-management/welcome-to-test/?id=${decodeURIComponent(idSessionCandidateLink)}`;
      const header = `${this.label['sendmail.invitecandidate.hello']} ` + candidat.fullName + ' ,';
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
        candidate_email: candidat.userKey.email_address,
        expired_date: this.expiredDay
      };
      this.testService.addTestInviteCandidates(inviteCandidateSend).subscribe((data) => {
        this.userService
          .sendMail(
            {
              receiver: {
                name: '',
                email: candidat.email_address
              },
              sender: {
                application: '',
                name: 'No Reply',
                email: candidat.email_address
              },
              modelCode: {
                applicationName: '',
                language_id: this.localStorageService.getItem('language').langId,
                application_id: this.utilsService.getApplicationID('SERVICIMA'),
                company_id: this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
              },
              text,
              subject: 'Évaluation technique',
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

  sort() {
    this.displayIcon = !this.displayIcon;
    if (this.displayIcon) {
      this.dataSourceInvoiceAttachment.data = _.orderBy(this.dataSourceInvoiceAttachment.data, [user => user.fullName.toLowerCase()], ['asc']);

    } else {
      this.dataSourceInvoiceAttachment.data = _.orderBy( this.dataSourceInvoiceAttachment.data , [user => user.fullName.toLowerCase()], ['desc']);

    }
  }

}
