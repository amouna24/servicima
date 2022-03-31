import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TrainingService } from '@core/services/training/training.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { dataAppearance } from '@shared/animations/animations';
import { FormControl } from '@angular/forms';

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
  nbtItems = new BehaviorSubject<number>(6);
  itemsPerPage = [5, 10, 25, 100];
  currentPage = 1;
  itemsPerPageControl = new FormControl(5);
  totalItems: number;
  countedItems = 0;
  nbrPages: number[];
  totalCountedItems = null;
  offset: number;
  limit: number;

  constructor(
      private location: Location,
      private trainingService: TrainingService,
      private userService: UserService,
      private localStorageService: LocalStorageService,
      private utilsService: UtilsService

  ) { }

  async ngOnInit(): Promise<void> {
    this.getDataFromLocalStorage();
   await this.getInvitation(this.nbtItems.getValue(), 0);
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
  async getInvitation(limit?, offset?) {
   await  this.trainingService
       .getTrainingInviteCollaborator
       (`?beginning=${offset}&number=${limit}&collaborator_email=${this.emailAddress}&status_invite=PENDING&status_invite=IGNORED`)
       .subscribe(async ( data) => {
         this.totalItems = data['total'] ? data['total'] : null;
         this.countedItems = data['count'] ? data['total'] : null;
         this.currentPage = this.offset === 1 ? 1 : this.currentPage;
         console.log('my offset ', this.offset);
         this.currentPage = this.offset === 1 ? 1 : this.currentPage;
         this.limit = data['limit'] ? Number(data['limit']) : null;
         this.nbrPages = data['total'] ? Array(Math.ceil(Number(data['total']) / this.nbtItems.getValue()))  .fill(null)
             .map((x, i) => i + 1) : null;
       this.invitesTraining = [];
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

  /**
   * @description load more data
   */
  async loadData(value: number) {
  await this.getInvitation(this.nbtItems.getValue(), (value - 1) * this.nbtItems.getValue());
  }
  /**************************************************************************
   * @description Get next, previous or specific page
   * @params type : next / previous / specific
   * @params pageNumber : number of specific page
   *************************************************************************/
  async getItemsPerPage(type: string, pageNumber?: number) {
    switch (type) {
      case 'first-page' : {
        this.currentPage = this.nbrPages ? this.nbrPages[0] : 1;
        await this.loadData(this.currentPage);

      }
        break;
      case 'previous-page' : {

        this.currentPage -= 1;
        await this.loadData(this.currentPage);

      }
        break;
      case 'specific-page' : {
        this.currentPage = pageNumber;
        console.log('current page', this.currentPage);
        await this.loadData(this.currentPage);

      }
        break;
      case 'next-page' : {

        this.currentPage += 1;
        await this.loadData(this.currentPage);

      }
        break;
      case 'last-page' : {

        this.currentPage = this.nbrPages[this.nbrPages.length - 1];
        await this.loadData(this.currentPage);

      }
        break;
    }
  }

}
