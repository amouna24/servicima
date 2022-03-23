import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { IInvoiceHeaderModel } from '@shared/models/invoiceHeader.model';
import { IContractor } from '@shared/models/contractor.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ITraining } from '@shared/models/training.model';
import { UserService } from '@core/services/user/user.service';
import { TrainingService } from '@core/services/training/training.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'wid-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent  implements OnInit, OnDestroy {
  type = 'Trainings';
  title = 'List Trainings';
  ELEMENT_DATA = new BehaviorSubject<ITraining[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
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
    { name: 'Delete', feature: 'SOURCING_CAND_FILE_ACCESS'},
    { name: 'Archiver', feature: 'SOURCING_CAND_FILE_ACCESS'}];
  constructor(
      private userService: UserService,
      private trainingService: TrainingService,
      private router: Router,
      private localStorageService: LocalStorageService,

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
       this.trainingService.getTraining(`?beginning=${offset}&number=${limit}&email_address=${this.companyEmail}`).subscribe((training) => {
          this.listTraining = training['results'];
          console.log('return data', this.listTraining);
          this.ELEMENT_DATA.next(this.listTraining);
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
       case ('delete') : console.log('delete');
         break;
       case ('archive') : console.log('archive');
         break;
       case ('update') : console.log('update');
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
}
