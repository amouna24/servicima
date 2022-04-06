import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';
import { TrainingService } from '@core/services/training/training.service';

@Component({
  selector: 'wid-details-invitation',
  templateUrl: './details-invitation.component.html',
  styleUrls: ['./details-invitation.component.scss']
})
export class DetailsInvitationComponent implements OnInit {
  title = 'Invitation details';
  trainingInformation: any;
  sessions: ITrainingSessionWeek[] = [];
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<DetailsInvitationComponent>,
      private trainingService: TrainingService
  ) {
    this.trainingInformation = this.data.training;
    this.sessions = this.data.sessions;
    console.log('training informations ', this.trainingInformation);
    console.log('sessions ', this.sessions);
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
