import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ITraining } from '@shared/models/training.model';
import { UserService } from '@core/services/user/user.service';
import { TrainingService } from '@core/services/training/training.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent  implements OnInit, OnDestroy {
  type = 'Trainings';
  title = 'List Trainings';
  ELEMENT_DATA = new BehaviorSubject<ITraining[]>([]);
  isLoading = new BehaviorSubject<boolean>(true);
  listTraining: ITraining[];
  companyEmail: string;
  finalMapping = new BehaviorSubject<any>([]);
  allowedActions = [];
  applicationId: string;
  languageId: string;
  userInfo: IUserInfo;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  subscriptionModal: Subscription;
  nbtItems = new BehaviorSubject<number>(5);
  featureAdd = 'SOURCING_CAND_FILE_ACCESS';

  tabFeatureAccess = [
    { name: 'Update', feature: 'SOURCING_CAND_FILE_ACCESS'},
    { name: 'update session', feature: 'SOURCING_CAND_FILE_ACCESS'},
    { name: 'Delete', feature: 'SOURCING_CAND_FILE_ACCESS'}];
  constructor(
      private userService: UserService,
      private trainingService: TrainingService,
      private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getConnectedUser();
    await  this.getTrainings(this.nbtItems.getValue(), 0);

  }

  ngOnDestroy(): void {
  }
  /**
   * @description Get connected user
   */
  getConnectedUser(): void {
    this.userService.connectedUser$.pipe(takeUntil(this.destroyed$))
        .subscribe(
            (userInfo) => {
              if (userInfo) {
                this.userInfo = userInfo['company'][0];
                this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
              }
            });
  }
  /**************************************************************************
   *  @description : get Training List
   *************************************************************************/
  getTrainings(limit?, offset?): Promise<ITraining[]> {
   return new Promise ((resolve) => {
       this.trainingService
           .getTraining(`?beginning=${offset}&number=${limit}&email_address=${this.companyEmail}&status=ACTIVE`).subscribe((training) => {
          this.listTraining = training['results'];
          this.ELEMENT_DATA.next(training);
          this.isLoading.next(false);
          resolve(this.listTraining);
       });
  });
  }
  /**************************************************************************
   * @description get selected Action From Dynamic DataTABLE
   * @param rowAction Object { data, rowAction }
   * data _id
   * rowAction [show, update, delete, download , activate]
   *************************************************************************/
  switchAction(rowAction: any) {
     switch (rowAction.actionType.name) {
       case ('show') : console.log('show');
       break;
       case ('Delete') : this.archive(rowAction.data[0]);
         break;
       case ('Update') : this.update(rowAction.data[0]);
         break;
       case ('update session') : this.updateSession(rowAction.data);
         break;
       case ('update') : this.update(rowAction.data);
       break;
     }
  }
  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  async loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    await this.getTrainings(params.limit, params.offset);
  }
  /**************************************************************************
   * @description update
   * @param params object
   *************************************************************************/
   update(training: ITraining) {
    this.router.navigate(['/manager/human-ressources/training/training-update'], {
      queryParams: {
        id: btoa(training._id),
        tc: btoa(training.TrainingKey.training_code)
      }
    });

  }
  /**************************************************************************
   * @description update session
   * @param params object
   *************************************************************************/
  updateSession(training: ITraining) {
    this.router.navigate(['/manager/human-ressources/training/session-training-update'], {
      queryParams: {
        id: btoa(training[0]._id),
        code: btoa(training[0].TrainingKey.training_code)
      }
    });
  }

  /**
   * @description archive training
   */
  archive(training: ITraining) {
   this.trainingService.disableTraining(training._id).subscribe(async (data) => {
     await this.getTrainings(this.nbtItems.getValue(), 0);

     this.trainingService.getTrainingInviteCollaborator(`?training_code=${training.TrainingKey.training_code}`).subscribe((invites) => {
       console.log('my invites ', invites);
       if (invites.length !== 0) {
         invites['results'].map((invite) => {
           this.trainingService.disableTrainingInviteCollaborator(invite._id)
               .subscribe((myInvite) => {
           });
         });
       }

     });
   });
  }

}
