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
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'wid-mailing-modal',
  templateUrl: './mailing-modal.component.html',
  styleUrls: ['./mailing-modal.component.scss']
})
export class MailingModalComponent implements OnInit {
  invoice = true;
  mailingForm: FormGroup;
  clientList: unknown = [];
  clientListSettings = { };
  selectable = true;
  removable = true;
  copyCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  copies: string[] = [];
  filteredCopies: Observable<string[]>;
  hiddenCopies: string[] = [];

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

   async ngOnInit(): Promise<void> {
     this.invoice = this.router.url !== '/manager/resume';
     this.initializeForm();
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
      copy: '',
      hidden_copy: '',
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
            item_id: oneData.contact_email,
            item_text: oneData.contractor_name + '(' + oneData.contact_email + ')',
          });
          if (index + 1 >= dataContractor['results'].length) {
            clientList.push({
              item_id: 'dhia.othmen@widigital-group.com',
              item_text: 'DBCOMPANY(dhia.othmen@widigital-group.com)',
            });
            resolve(clientList);
          }
        });
      });
    }).then( (res) => {
      return res;
    });
  }
  sendMail() {
    const mailingObject = this.mailingForm.value;
    const contacts = [];
    mailingObject.contact.forEach( (contact) => {
      contacts.push(contact.item_id);
    });
    if (!this.invoice) {
      const attachments: object[] = [];
      let application_id = '';
      this.data.map( (sendMailData) => {
        application_id = sendMailData.user_info.ResumeKey.application_id;
        if (mailingObject.format === 'DOCX') {
          attachments.push({
            filename: sendMailData.user_info.init_name + '.docx',
            path: `${environment.uploadFileApiUrl}/show/${sendMailData.resume_filename_docx}` });
        } else {
          attachments.push({
            filename: sendMailData.user_info.init_name + '.pdf',
            path: `${environment.uploadFileApiUrl}/show/${sendMailData.resume_filename_pdf}` });
        }
      });
              this.resumeService
                .sendMail(
                  this.localStorageService.getItem('language').langId,
                  application_id,
                  this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
                  contacts,
                  mailingObject.subject,
                  mailingObject.message,
                  attachments,
                  this.copies,
                  this.hiddenCopies,
                ).subscribe((dataB) => {
                console.log(dataB);
              });
    }
  }
  addCopy(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.copies.push(value);
    }
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

    if (value) {
      this.hiddenCopies.push(value);
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
