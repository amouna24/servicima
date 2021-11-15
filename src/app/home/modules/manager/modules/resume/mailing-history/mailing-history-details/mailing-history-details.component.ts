import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ResumeService } from '@core/services/resume/resume.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-mailing-history-details',
  templateUrl: './mailing-history-details.component.html',
  styleUrls: ['./mailing-history-details.component.scss']
})
export class MailingHistoryDetailsComponent implements OnInit {
  send_time: Date;
  send_to: string;
  copies: string[];
  hiddenCopies: string[];
  message: string;
  subject: string;
  attachments: object[];
  subscriptionModal: Subscription;

  constructor(
    private router: Router,
    private resumeService: ResumeService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private modalService: ModalService,
  ) {
    if (this.router.getCurrentNavigation()) {
      this.getDataFromPreviousRoute();
    } else {
      this.router.navigate(['/manager/resume/history']);
    }
  }

  ngOnInit(): void {
  }

  getDataFromPreviousRoute() {
    this.send_time = this.router.getCurrentNavigation().extras.state?.send_time;
    this.send_to = this.router.getCurrentNavigation().extras.state?.send_to;
    this.copies = this.router.getCurrentNavigation().extras.state?.copies;
    this.hiddenCopies = this.router.getCurrentNavigation().extras.state?.hidden_copies;
    this.message = this.router.getCurrentNavigation().extras.state?.message;
    this.subject = this.router.getCurrentNavigation().extras.state?.subject;
    this.attachments = this.router.getCurrentNavigation().extras.state?.attachment;
  }

  downloadDoc(attachment: object) {
    saveAs(attachment['path'], attachment['filename']);
  }

  resendMail() {
    const confirmation = {
      code: 'edit',
      title: `Resend this Mail to ${this.send_to}`,
      description: `Are you sure ?`,
    };
    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '550px', '350px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService
              .sendMail(
                this.localStorageService.getItem('language').langId,
                this.utilsService.getApplicationID('SERVICIMA'),
                this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
                [this.send_to],
                this.message,
                this.attachments,
                this.copies,
                this.hiddenCopies,
                this.subject,
              ).subscribe((dataB) => {
              console.log('email resended');
            });
          }
        });
  }
  backButton() {
    this.router.navigate(['/manager/resume/history']);
  }
}
