import { Component, Inject, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITraining } from '@shared/models/training.model';
import { TrainingService } from '@core/services/training/training.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

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
                console.log('invite sended');
            });
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
