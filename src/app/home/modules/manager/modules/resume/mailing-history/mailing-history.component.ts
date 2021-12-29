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
  Archive = 'Disable';
  nbtItems = new BehaviorSubject<number>(5);
  constructor(
    private userService: UserService,
    private resumeService: ResumeService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.getData('ACTIVE', 0, 5);
  }

  /**************************************************************************
   * @description Get Users Data  from user service and resume service
   *************************************************************************/
  async getData(status, offset, limit) {
    if (status === 'ACTIVE') {
      this.Archive = 'Disable';
    } else {
      this.Archive = 'Enable';
    }
    this.isLoading.next(true);
    this.userService.connectedUser$
      .subscribe((userInfo) => {
        this.resumeService
          .getMailingHistory(`?company_email=${userInfo?.company[0].companyKey.email_address}&status=${status}&beginning=${offset}&number=${limit}`)
          .subscribe(async (mailingList) => {
            return new Promise((resolve) => {
              if (mailingList['msg_code'] !== '0004') {
                resolve(mailingList['results'].map((mailing, index) => {
                  const sendTime = mailing.MailingHistoryKey.send_time;
                  const sendTo = mailing.MailingHistoryKey.send_to;
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
              mailingList['results'] = result;
              console.log('result=', result);
              this.isLoading.next(false);
              this.tableData.next(mailingList);
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
      case(this.Archive):
        this.DisableEnableMail(rowAction.data, this.Archive);
        break;
    }
  }

  private showMailDetails(data) {
    this.resumeService.getMailingHistory(`?send_to=${data.send_to}&send_time=${data.send_time}`)
      .subscribe((mailingData) => {
        console.log('mailing data', mailingData['results'][0]);
        this.router.navigate(['/manager/resume/history/details'],
          {
            state: {
              send_time: mailingData['results'][0].MailingHistoryKey.send_time,
              send_to: mailingData['results'][0].MailingHistoryKey.send_to,
              copies: mailingData['results'][0].copy,
              hidden_copies: mailingData['results'][0].hidden_copy,
              message: mailingData['results'][0].message,
              subject: mailingData['results'][0].subject,
              attachment: mailingData['results'][0].attachment
            }
          });
      });
  }
  private resendMail(data) {
    data.map((mailHistory) => {
      this.resumeService.getMailingHistory(`?send_to=${mailHistory.send_to}&send_time=${mailHistory.send_time}`)
        .subscribe((historyData) => {
          this.resumeService
            .sendMail(
              this.localStorageService.getItem('language').langId,
              this.utilsService.getApplicationID('SERVICIMA'),
              this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
              [mailHistory.send_to],
              historyData['results'][0].attachment,
              historyData['results'][0].copy,
              historyData['results'][0].hidden_copy,
              mailHistory.subject,
              mailHistory.message,
            ).subscribe((dataB) => {
            console.log('email resended');
          });
        });
    });
  }

  private DisableEnableMail(data, action) {
    console.log('data=', data, 'table data=', this.tableData);
    data.map((mailHistory) => {
      console.log(`?send_to=${mailHistory.send_to}&send_time=${mailHistory.send_time}`);
      this.resumeService.getMailingHistory(`?send_to=${mailHistory.send_to}&send_time=${mailHistory.send_time}`)
        .subscribe((historyData) => {
          console.log('history data', historyData);
          historyData['results'][0].application_id = historyData[0].MailingHistoryKey.application_id;
          historyData['results'][0].send_to = historyData[0].MailingHistoryKey.send_to;
          historyData['results'][0].send_time = historyData[0].MailingHistoryKey.send_time;
          historyData['results'][0].company_email = historyData[0].MailingHistoryKey.company_email;
          if (action === 'Disable') {
            historyData[0].status = 'DISABLED' ;
            this.resumeService.updateMailingHistory(historyData[0]).subscribe(async (mailingUpdate) => {
              console.log('history disabled', mailingUpdate);
              await this.getData('ACTIVE', 0, 5);
            });
          } else {
            historyData[0].status = 'ACTIVE' ;
            this.resumeService.updateMailingHistory(historyData[0]).subscribe(async (mailingUpdate) => {
              console.log('history enabled', mailingUpdate);
              await this.getData('DISABLED', 0, 5);
            });
          }

        });
    });
  }
  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getData('ACTIVE', params.offset, params.limit);
  }
}
