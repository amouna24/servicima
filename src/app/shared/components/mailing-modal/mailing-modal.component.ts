import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { UserService } from '@core/services/user/user.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { InvoiceService } from '@core/services/invoice/invoice.service';

import { Observable } from 'rxjs';
import { IResumeMailingHistoryModel } from '@shared/models/mailingHistory.model';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'wid-mailing-modal',
  templateUrl: './mailing-modal.component.html',
  styleUrls: ['./mailing-modal.component.scss']
})
export class MailingModalComponent implements OnInit {
  invoice = true;
  mailingForm: FormGroup;
  clientList = [];
  clientListSettings = { };
  selectable = true;
  removable = true;
  copyCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  copies: string[] = [];
  filteredCopies: Observable<string[]>;
  hiddenCopies: string[] = [];
  showCopyError: boolean;
  showHiddenCopyError: boolean;
  @ViewChild('copiesList') copiesList;
  @ViewChild('hiddenCopiesList') hiddenCopiesList;

  @ViewChild('copyInput') copyInput: ElementRef<HTMLInputElement>;
  @ViewChild('hiddenCopyInput') hiddenCopyInput: ElementRef<HTMLInputElement>;

  private hiddenCopyCtrl = new FormControl();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private clientService: ContractorsService,
    private userService: UserService,
    private invoiceService: InvoiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.invoice = this.router.url !== '/manager/resume';
    this.initializeForm();
    // @ts-ignore
    this.clientList = await this.getClients();
    this.clientListSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'All',
      unSelectAllText: 'All',
      allowSearchFilter: true
    };
  }
  initializeForm() {
    this.mailingForm = this.fb.group( {
      contact: ['', [Validators.required]],
      copy: [''],
      hidden_copy: [''],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      format: ['', [Validators.required]],
    });
  }
  async getClients() {
    const clientList = [];
    return new Promise( (resolve) => {
      this.clientService.getContractors(`?email_address=${this.userService.connectedUser$
        .getValue().user[0]['company_email']}`).subscribe((dataContractor) => {
        dataContractor['results'].forEach((oneData, index) => {
          clientList.push({
            item_id: oneData.contractorKey.contractor_code,
            item_text: oneData.contractor_name + '(' + oneData.contact_email + ')     ',
            item_email: oneData.contact_email,
          });
          if (index + 1 >= dataContractor['results'].length) {
            resolve(clientList);
          }
        });
      });
    }).then( (res) => {
      return res;
    });
  }
  async sendMail() {
    const mailingObject = this.mailingForm.value;

    mailingObject.contact.forEach((contact) => {
      new Promise( (resolveMail) => {
        this.clientList.forEach( (client) => {
          if (client.item_id === contact.item_id) {
            resolveMail(client.item_email);
          }
        });
      }).then( (email: string) => {
        if (!this.invoice) {
          const attachments: object[] = [];
          let application_id = '';
          new Promise (async resolveMail => {
            await this.data.map((sendMailData) => {
              application_id = sendMailData.user_info.ResumeKey.application_id;
              if (mailingObject.format === 'DOCX') {
                this.resumeService
                  .getResumeList(
                    `?collaborator_email=${sendMailData.user_info.ResumeKey.email_address}&contractor_code=${contact.item_id}&file_type=docx`)
                  .subscribe((response) => {
                    attachments.push({
                      filename: sendMailData.user_info.init_name + '.docx',
                      path: `${environment.uploadResumeFileApiUrl}/show/${response[0].file_name}`
                    });
                    if (attachments.length ===  this.data.length) {
                      resolveMail(attachments);
                    }
                  });
              } else {
                this.resumeService
                  .getResumeList(
                    `?collaborator_email=${sendMailData.user_info.ResumeKey.email_address}&contractor_code=${contact.item_id}&file_type=pdf`)
                  .subscribe((response) => {
                    attachments.push({
                      filename: sendMailData.user_info.init_name + '.pdf',
                      path: `${environment.uploadResumeFileApiUrl}/show/${response[0].file_name}`
                    });
                    if (attachments.length === this.data.length) {
                      resolveMail(attachments);
                    }
                  });
              }
            });
          }).then( (attach: string[]) => {
            console.log(this.data[0]);
            this.resumeService
              .sendMail(
                this.localStorageService.getItem('language').langId,
                this.utilsService.getApplicationID('SERVICIMA'),
                this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
                [email],
                mailingObject.message,
                attach,
                this.copies,
                this.hiddenCopies,
                mailingObject.subject,
                mailingObject.message,
              ).subscribe((dataB) => {
              const mailingHistoryObject: IResumeMailingHistoryModel = {
                MailingHistoryKey: {
                  application_id:  this.data[0].user_info.ResumeKey.application_id,
                  company_email: this.data[0].company_email,
                  send_time: new Date(Date.now()),
                  send_to: email,
                },
                application_id:  this.data[0].user_info.ResumeKey.application_id,
                company_email: this.data[0].company_email,
                send_time: new Date(Date.now()),
                send_to: email,
                subject: mailingObject.subject,
                message: mailingObject.message,
                attachment: attach,
                copy: this.copies,
                hidden_copy: this.hiddenCopies,
              };
              this.resumeService.addMailingHistory(mailingHistoryObject).subscribe( (history) => {
                console.log('mail add to history');
              });
              console.log('email send', this.localStorageService.getItem('language').langId,
                this.utilsService.getApplicationID('SERVICIMA'),
                this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
                [email],
                mailingObject.subject,
                mailingObject.message,
                attach,
                this.copies,
                this.hiddenCopies);
            });
          });
        } else {

          this.data.map((data) => {
            this.invoiceService.sendInvoiceMail(this.localStorageService.getItem('language').langId,
              this.localStorageService.getItem('userCredentials').application_id,
              this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
              'dhia.othmen@widigital-group.com',
              data.contractor_code,
              'data.user_info.actual_job',
              '${environment.uploadFileApiUrl}/show/${data.resume_filename_docx}',
              [{ filename: 'invoice' + data.InvoiceHeaderKey.invoice_nbr + '.pdf',
                path: environment.uploadFileApiUrl + '/show/' + data.attachment },
              ], this.copies,
              this.hiddenCopies,
            ).subscribe(() => {
            });
          });
        }
      });
    });
  }
  addCopy(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(value.toLowerCase())) {
      this.copies.push(value);
      this.copiesList.errorState = false;
    } else {
      this.copiesList.errorState = true;
    }
    console.log('copiesList', this.copiesList);
    this.mailingForm.controls.copy.setValue('');
    this.copyCtrl.setValue(null);
  }

  removeCopy(fruit: string): void {
    const index = this.copies.indexOf(fruit);

    if (index >= 0) {
      this.copies.splice(index, 1);
    }
  }

  addHiddenCopy(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(value.toLowerCase())) {
      this.hiddenCopies.push(value);
      this.hiddenCopiesList.errorState = false;
    } else {
      this.hiddenCopiesList.errorState = true;
    }
    this.mailingForm.controls.hidden_copy.setValue('');

    this.hiddenCopyCtrl.setValue(null);
  }

  removeHiddenCopy(fruit: string): void {
    const index = this.hiddenCopies.indexOf(fruit);

    if (index >= 0) {
      this.hiddenCopies.splice(index, 1);
    }
  }

}
