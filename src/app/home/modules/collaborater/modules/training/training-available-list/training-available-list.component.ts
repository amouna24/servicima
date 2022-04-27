import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { dataAppearance } from '@shared/animations/animations';
import { TrainingService } from '@core/services/training/training.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';

@Component({
  selector: 'wid-training-available-list',
  templateUrl: './training-available-list.component.html',
  styleUrls: ['./training-available-list.component.scss'],
  animations: [
    dataAppearance
  ]
})
export class TrainingAvailableListComponent implements OnInit {
  title = 'Available Training';
  emailAddress: string;
  applicationId: string;
  ELEMENT_DATA = new BehaviorSubject<any[]>([]);
  availableTrainingList: any[] = [];
  userInfo: IUserInfo;
  companyEmail: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }
  constructor(
      private location: Location,
      private trainingService: TrainingService,
      private localStorageService: LocalStorageService,
      private refDataService: RefdataService,
      private utilsService: UtilsService,
      private userService: UserService,

  ) {
    this.getDataFromLocalStorage();
  }

  async ngOnInit(): Promise<void> {
    await this.getConnectedUser();
  }

  /**
   * @description list available training
   */
  async getAvailableTraining(limit?, offset?) {
      await this.trainingService
          .getTraining
          (`?beginning=${offset}&number=${limit}`);
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
  /**
   * @description get connected user from local storage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.emailAddress = cred['email_address'];
    this.applicationId = cred['application_id'];
  }

}
