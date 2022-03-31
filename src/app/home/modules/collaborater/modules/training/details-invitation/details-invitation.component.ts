import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';

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
  ) {
    this.trainingInformation = this.data.training;
    this.sessions = this.data.sessions;
    console.log('training informations ', this.trainingInformation);
    console.log('sessions ', this.sessions);
  }

  ngOnInit(): void {
  }

}
