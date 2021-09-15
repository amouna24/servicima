import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { UserService } from '@core/services/user/user.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'wid-mailing-modal',
  templateUrl: './mailing-modal.component.html',
  styleUrls: ['./mailing-modal.component.scss']
})
export class MailingModalComponent implements OnInit {
  invoice = true;
  mailingForm: FormGroup;
  clientList: object[] = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = { };
  title = 'multiselectdropdown';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private clientService: ContractorsService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

   async ngOnInit(): Promise<void> {
     this.invoice = this.router.url !== '/manager/resume';
     this.initializeForm();
     await this.getClients();
     this.dropdownList = [
       { item_id: 1, item_text: 'Mumbai'},
       { item_id: 2, item_text: 'Bangaluru'},
       { item_id: 3, item_text: 'Pune'},
       { item_id: 4, item_text: 'Navsari'},
       { item_id: 5, item_text: 'New Delhi'}
     ];
     console.log(this.clientList, this.dropdownList);
     this.selectedItems = [
       { item_id: 3, item_text: 'Pune'},
       { item_id: 4, item_text: 'Navsari'}
     ];
     this.dropdownSettings = {
       singleSelection: false,
       idField: 'item_id',
       textField: 'item_text',
       selectAllText: 'Select All',
       unSelectAllText: 'UnSelect All',
       itemsShowLimit: 3,
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
  getClients() {
    this.clientService.getContractors(`?email_address=${this.userService.connectedUser$
      .getValue().user[0]['company_email']}`).subscribe( (dataContractor) => {
      dataContractor['results'].forEach( (oneData, index) => {
          this.clientList.push({
            item_id: index + 1,
            item_text: oneData.contact_email,
          });
        });
    });
  }
  sendMail() {
    const mailingObject = this.mailingForm.value;
    console.log(mailingObject);
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
                  mailingObject.contact,
                  mailingObject.subject,
                  mailingObject.message,
                  attachments,
                  mailingObject.copy,
                  mailingObject.hidden_copy,
                ).subscribe((dataB) => {
                console.log(dataB);
              });
    }
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
