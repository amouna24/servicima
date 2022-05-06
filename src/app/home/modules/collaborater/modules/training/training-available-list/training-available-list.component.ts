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
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

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
  sortedby: string;
  displayIcon: boolean;
  column: string;

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
    this.displayIcon = true;
  }

  async ngOnInit(): Promise<void> {
    await this.getConnectedUser();
    await this.getAvailableTraining(this.nbtItems.getValue(), 0);
  }

  /**
   * @description list available training
   */
  async getAvailableTraining(limit?, offset?) {
      await this.trainingService
          .getTraining
          (`?beginning=${offset}&number=${limit}&email_address=${this.companyEmail}`).subscribe(async (data) => {
            this.totalItems = data['total'] ? data['total'] : null;
            this.countedItems = data['count'] ? data['total'] : null;
            this.currentPage = this.offset === 1 ? 1 : this.currentPage;
            this.limit = data['limit'] ? Number(data['limit']) : null;
            this.nbrPages = data['total'] ? Array(Math.ceil(Number(data['total']) / this.nbtItems.getValue()))  .fill(null)
                .map((x, i) => i + 1) : null;
            this.availableTrainingList = data['results'];
            this.ELEMENT_DATA.next(this.availableTrainingList);
          });
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
   * @description sort
   * @param column: column to sort
   */
  sort(column) {
    this.displayIcon = !this.displayIcon;
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
   * @params event
   * @description table sorted by field
   */
  sortedBy(event: MatSelectChange) {

  }
  /**
   * @description load more data
   */
  async loadData(value: number) {
    await this.getAvailableTraining(this.nbtItems.getValue(), (value - 1) * this.nbtItems.getValue());
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
