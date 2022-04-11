import { Component, Input, OnInit } from '@angular/core';
import { TrainingService } from '@core/services/training/training.service';
import { BehaviorSubject } from 'rxjs';
import { ITraining } from '@shared/models/training.model';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { ITrainingRequest } from '@shared/models/trainingRequest.model';

@Component({
  selector: 'wid-list-request-training',
  templateUrl: './list-request-training.component.html',
  styleUrls: ['./list-request-training.component.scss']
})
export class ListRequestTrainingComponent implements OnInit {

  @Input() email: string;
  @Input() collaborator: boolean;
  @Input() title: string;
  ELEMENT_DATA = new BehaviorSubject<ITraining[]>([]);
  isLoading = new BehaviorSubject<boolean>(true);
  listRequest: ITraining[];
  nbtItems = new BehaviorSubject<number>(5);
  featureAdd = 'SOURCING_CAND_FILE_ACCESS';

  tabFeatureAccess = [
    { name: 'Update', feature: 'SOURCING_CAND_FILE_ACCESS'},
    { name: 'Show', feature: 'SOURCING_CAND_FILE_ACCESS'},
    { name: 'Delete', feature: 'SOURCING_CAND_FILE_ACCESS'}];

  constructor(
      private userService: UserService,
      private trainingService: TrainingService,
      private router: Router

) { }

  ngOnInit(): void {
  }

  /**
   * @description Request List Training
   */
  getTrainingsRequest(limit?, offset?): Promise<ITrainingRequest[]> {
  return new Promise((resolve) => {
    this.trainingService.getTrainingRequest(`?beginning=${offset}&number=${limit}&email_address=${this.email}&status=ACTIVE`)
        .subscribe((request) => {
            this.listRequest = request['results'];
            this.ELEMENT_DATA.next(request);
            this.isLoading.next(false);
            resolve(this.listRequest);
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
      case('show') : console.log('show');
      break;
      case ('Delete') : console.log('delete');
      break;
      case ('Update') : console.log('Update');
      break;
      case ('update'): console.log('update');
    }
  }
  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  async loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    await this.getTrainingsRequest(params.limit, params.offset);
  }

}
