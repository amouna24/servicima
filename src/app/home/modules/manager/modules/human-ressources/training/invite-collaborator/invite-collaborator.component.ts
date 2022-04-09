import { Component, Inject, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITraining } from '@shared/models/training.model';
import { TrainingService } from '@core/services/training/training.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-invite-collaborator',
  templateUrl: './invite-collaborator.component.html',
  styleUrls: ['./invite-collaborator.component.scss']
})
export class InviteCollaboratorComponent implements OnInit {

  training: ITraining;
  applicationId: string;
  companyEmail: string;
    tableColumns = [
        { nameColumn: 'full_name', photo: 'photo'},
        { nameColumn: 'job_title', iconColumn: 'wi-bag'},
        { nameColumn: 'email_address', iconColumn: 'email'},
        ];
    selection = new SelectionModel<any>(true, []);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<InviteCollaboratorComponent>,
        private trainingService: TrainingService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService

    ) {
        this.training = data.training;
    }

  /**
   * @description Init component
   */
  async ngOnInit(): Promise<void> {
    this.getDataFromLocalStorage();
    console.log('get list');
  }

    /**
     * @description send Request to collaborator
     */
    sendRequest(event) {
        event.map((collaborator) => {
            console.log('invite sended ', collaborator);
            const inviteCollaborator = {
                email_address: this.companyEmail,
                application_id: this.applicationId,
                training_code: this.training.TrainingKey.training_code,
                collaborator_email: collaborator.email_address,
                status_invite: 'PENDING'
            };
            this.trainingService.addTrainingInviteCollaborator(inviteCollaborator).subscribe((data) => {
                console.log('invitation sended successfully');
                this.sendMail(collaborator.email_address, collaborator.fullName, 'testurl');
            });
        });

  }

    /**
     * @description send mail
     */
    sendMail(emailCollaborator, fullName, url) {
        this.trainingService
            .sendMail(
                {
                    receiver: {
                        name: '',
                        email: 'weed.wd2019@gmail.com'
                    },
                    sender: {
                        application: '',
                        name: 'No Reply',
                        email: emailCollaborator
                    },
                    details: {
                        var_param_1: `${fullName}`,
                        url_param_1: `${url}`,
                    },

                    modelCode: {
                        applicationName: '',
                        model_code: 'TRAINING_INVITATION',
                        language_id: this.localStorageService.getItem('language').langId,
                        application_id: this.utilsService.getApplicationID('SERVICIMA'),
                        company_id: this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
                    },
                    attachement: [],
                    emailcc: '',
                    emailbcc: '',
                }
            ).subscribe((dataB) => {
            console.log('email send successfully');
    });
    }

    /**
     * @description cancel
     */
    cancel() {
        this.dialogRef.close(false);
    }
    /**
     * @description Get data from localstorage
     */
    getDataFromLocalStorage() {
        const cred = this.localStorageService.getItem('userCredentials');
        this.applicationId = cred['application_id'];
        this.companyEmail = cred['email_address'];
    }

}
