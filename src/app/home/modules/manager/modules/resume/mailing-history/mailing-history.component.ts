import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ResumeService } from '@core/services/resume/resume.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-mailing-history',
  templateUrl: './mailing-history.component.html',
  styleUrls: ['./mailing-history.component.scss']
})
export class MailingHistoryComponent implements OnInit {
  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private userService: UserService,
    private resumeService: ResumeService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
  }

  /**************************************************************************
   * @description Get Users Data  from user service and resume service
   *************************************************************************/
  async getData() {
    this.isLoading.next(true);
    this.userService.connectedUser$
      .subscribe((userInfo) => {
        this.resumeService.getMailingHistory(`?company_email=${userInfo?.company[0].companyKey.email_address}&status=ACTIVE`)
          .subscribe(async (mailingList) => {
            return new Promise((resolve) => {
              if (mailingList['msg_code'] !== '0004') {
                resolve(mailingList.map((mailing, index) => {
                  const sendTime = mailing.MailingHistoryKey.send_time;
                  const sendTo = mailing.MailingHistoryKey.send_to;
                  console.log({
                    attachment: mailing.attachment.length,
                    message: mailing.message,
                    subject: mailing.subject,
                    send_to: mailing.send_to,
                    send_time: mailing.MailingHistoryKey.send_time
                  });
                    return {
                      send_time: sendTime,
                      send_to: sendTo,
                      attachment: mailing.attachment.length,
                      message: mailing.message,
                      subject: mailing.subject,
                    };
                }));
              } else {
                resolve([]);
              }
            }).then((result) => {
              console.log('table data=', this.tableData);
              this.isLoading.next(false);
              this.tableData.next(result);
            });
          });
      });
  }

  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('Resend'):
        this.resendMail(rowAction.data);
        break;
      case ('update'):
        this.showMailDetails(rowAction.data);
        break;
      case('Delete'):
        this.DisableMail(rowAction.data);
        break;
    }
  }

  private showMailDetails(data) {
    this.resumeService.getMailingHistory(`?send_to=${data.send_to}&send_time=${data.send_time}`)
      .subscribe((mailingData) => {
        console.log('mailing data', mailingData[0]);
        this.router.navigate(['/manager/resume/history/details'],
          {
            state: {
              send_time: mailingData[0].MailingHistoryKey.send_time,
              send_to: mailingData[0].MailingHistoryKey.send_to,
              copies: mailingData[0].copy,
              hidden_copies: mailingData[0].hidden_copy,
              message: mailingData[0].message,
              subject: mailingData[0].subject,
              attachment: mailingData[0].attachment
            }
          });
      });
  }

  private resendMail(data) {
    data.map((mailHistory) => {
      console.log(data);
      this.resumeService.getMailingHistory(`?send_to=${mailHistory.send_to}&send_time=${mailHistory.send_time}`)
        .subscribe((historyData) => {
          this.resumeService
            .sendMail(
              this.localStorageService.getItem('language').langId,
              this.utilsService.getApplicationID('SERVICIMA'),
              this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
              [mailHistory.send_to],
              mailHistory.message,
              historyData[0].attachment,
              historyData[0].copy,
              historyData[0].hidden_copy,
              mailHistory.subject,
            ).subscribe((dataB) => {
            console.log('email resended');
          });
        });
    });
  }

  private DisableMail(data) {
    console.log('data=', data, 'table data=', this.tableData);
    data.map((mailHistory) => {
      console.log(`?send_to=${mailHistory.send_to}&send_time=${mailHistory.send_time}`);
      this.resumeService.getMailingHistory(`?send_to=${mailHistory.send_to}&send_time=${mailHistory.send_time}`)
        .subscribe((historyData) => {
          console.log('history data', historyData);
          historyData[0].application_id = historyData[0].MailingHistoryKey.application_id;
          historyData[0].send_to = historyData[0].MailingHistoryKey.send_to;
          historyData[0].send_time = historyData[0].MailingHistoryKey.send_time;
          historyData[0].company_email = historyData[0].MailingHistoryKey.company_email;
          historyData[0].status = 'DISABLED';
         this.resumeService.updateMailingHistory(historyData[0]).subscribe(async (mailingUpdate) => {
           console.log('history disabled', mailingUpdate);
           await this.getData();
         });
        });
    });
  }
}
