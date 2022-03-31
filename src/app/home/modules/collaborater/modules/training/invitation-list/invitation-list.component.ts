import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TrainingService } from '@core/services/training/training.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { dataAppearance } from '@shared/animations/animations';

@Component({
  selector: 'wid-invitation-list',
  templateUrl: './invitation-list.component.html',
  styleUrls: ['./invitation-list.component.scss'],
  animations: [
      dataAppearance
  ]
})
export class InvitationListComponent implements OnInit {

  title = 'Invitation List';
  emailAddress: string;
  applicationId: string;
  ELEMENT_DATA = new BehaviorSubject<any[]>([]);
  PENDING_DATA = new BehaviorSubject<any[]>([]);
  IGNORED_DATA = new BehaviorSubject<any[]>([]);
  invitesTraining: any[] = [];

  constructor(
      private location: Location,
      private trainingService: TrainingService,
      private userService: UserService,
      private localStorageService: LocalStorageService,
      private utilsService: UtilsService

  ) { }

  async ngOnInit(): Promise<void> {
    this.getDataFromLocalStorage();
   await this.getInvitation();
  }
  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }

  /**
   * @description get invitation training
   */
  async getInvitation() {
   await  this.trainingService.getTrainingInviteCollaborator(`?collaborator_email=${this.emailAddress}`).subscribe(async ( data) => {
      data['results'].map((invites) => {
        this.trainingService.getTraining(`?training_code=${invites.TrainingInviteCollaboratorKey.training_code}`).subscribe(async (training) => {
          this.invitesTraining.push({ ...invites, ...training['results'][0]});
          this.ELEMENT_DATA.next(this.invitesTraining);
          this.PENDING_DATA.next(this.ELEMENT_DATA.getValue().filter(x => x.status_invite === 'PENDING'));
          this.IGNORED_DATA.next(this.ELEMENT_DATA.getValue().filter(x => x.status_invite === 'IGNORED'));
        });
      });
    });
  }

  /**
   * @description get connected user from local storage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.emailAddress = cred['email_address'];
    this.applicationId = cred['application_id'];
  }

  /**
   * @description accept invitation training
   */
  acceptInvitation(event) {
    this.invitesTraining
        .filter
        (x => (x.TrainingInviteCollaboratorKey.collaborator_email === event.TrainingInviteCollaboratorKey.collaborator_email)
            && (x.TrainingInviteCollaboratorKey.training_code === event.TrainingInviteCollaboratorKey.training_code))[0].status_invite = 'ACCEPT';
    this.ELEMENT_DATA.next(this.invitesTraining);
    this.PENDING_DATA.next(this.ELEMENT_DATA.getValue().filter(x => x.status_invite === 'PENDING'));
    this.IGNORED_DATA.next(this.ELEMENT_DATA.getValue().filter(x => x.status_invite === 'IGNORED'));

  }

  /**
   * @description ignore invitation training
   */
  ignoreInvitation(event) {
    this.invitesTraining
        .filter
        (x => (x.TrainingInviteCollaboratorKey.collaborator_email === event.TrainingInviteCollaboratorKey.collaborator_email)
        && (x.TrainingInviteCollaboratorKey.training_code === event.TrainingInviteCollaboratorKey.training_code))[0].status_invite = 'IGNORED';
   this.ELEMENT_DATA.next(this.invitesTraining);
    this.PENDING_DATA.next(this.ELEMENT_DATA.getValue().filter(x => x.status_invite === 'PENDING'));
    this.IGNORED_DATA.next(this.ELEMENT_DATA.getValue().filter(x => x.status_invite === 'IGNORED'));
  }

}
