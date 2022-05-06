import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';
import { TrainingService } from '@core/services/training/training.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-details-invitation',
  templateUrl: './details-invitation.component.html',
  styleUrls: ['./details-invitation.component.scss']
})
export class DetailsInvitationComponent implements OnInit {
  title = 'Invitation details';
  trainingInformation: any;
  emailCollaborator: string;
  applicationId: string;
  sessions: ITrainingSessionWeek[] = [];
  apply: boolean;
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<DetailsInvitationComponent>,
      private trainingService: TrainingService,
      private utilsService: UtilsService,
      private localStorageService: LocalStorageService
  ) {
    this.getDataFromLocalStorage();
    this.trainingInformation = this.data.training;
    this.sessions = this.data.sessions;
    this.apply = this.data.apply;
  }
  applyTraining() {
    const obj = {
      'application_id': this.trainingInformation.TrainingKey.application_id,
      'email_address': this.trainingInformation.TrainingKey.email_address,
      'training_code': this.trainingInformation.TrainingKey.training_code,
      'collaborator_email': this.emailCollaborator,
      'status_invite': 'APPLY',
      'status': 'ACTIVE'
    };
    this.trainingService.addTrainingInviteCollaborator(obj).subscribe((data) => {
       this.utilsService.openSnackBar('add successfully ', '' , 3000);
    }, err => {
      if (err.error['msg_code']) {
        this.utilsService.openSnackBar('you are already apply to this training', '' , 3000);

      }
    });

  }
  /**
   * @description get connected user from local storage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.emailCollaborator = cred['email_address'];
    this.applicationId = cred['application_id'];
  }

  ngOnInit(): void {
  }
  accept() {
    this.trainingService.updateTrainingInviteCollaborator({
      'application_id': this.trainingInformation.TrainingInviteCollaboratorKey.application_id,
      'email_address': this.trainingInformation.TrainingInviteCollaboratorKey.email_address,
      'training_code': this.trainingInformation.TrainingInviteCollaboratorKey.training_code,
      'collaborator_email': this.trainingInformation.TrainingInviteCollaboratorKey.collaborator_email,
      'status_invite': 'ACCEPT',
      'status': 'ACTIVE'
    }).subscribe((invite) => {
      this.trainingInformation.status_invite = 'ACCEPT';
      console.log('invite success');
    });
  }
  ignore() {
    this.trainingService.updateTrainingInviteCollaborator({
      'application_id': this.trainingInformation.TrainingInviteCollaboratorKey.application_id,
      'email_address': this.trainingInformation.TrainingInviteCollaboratorKey.email_address,
      'training_code': this.trainingInformation.TrainingInviteCollaboratorKey.training_code,
      'collaborator_email': this.trainingInformation.TrainingInviteCollaboratorKey.collaborator_email,
      'status_invite': 'IGNORED',
      'status': 'ACTIVE'
    }).subscribe((invite) => {
      this.trainingInformation.status_invite = 'IGNORED';
      console.log('invite success');
    });
  }

}
