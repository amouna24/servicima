import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IHrContract } from '@shared/models/hrContract.model';
import { ICollaborator } from '@shared/models/collaborator.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IViewParam } from '@shared/models/view.model';
import { TrainingService } from '@core/services/training/training.service';

@Component({
  selector: 'wid-show-training-request',
  templateUrl: './show-training-request.component.html',
  styleUrls: ['./show-training-request.component.scss']
})
export class ShowTrainingRequestComponent implements OnInit {
  contractInfo: IHrContract;
  trainingRequest: any;
  collaboratorInfo: ICollaborator;
  nationnality = '';
  title: string;
  domain: string;

  userInfo: any;
  nationalitiesList: IViewParam[] = [];

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private localStorageService: LocalStorageService,
      private utilsService: UtilsService,
      private trainingService: TrainingService

  ) {
    this.contractInfo = this.data.data[0];
    this.collaboratorInfo = this.data.data[1];
    this.trainingRequest = this.data.training;
    this.userInfo = this.data.data[2];
    this.title = this.data.title;
    this.domain = this.data.domain;
    this.utilsService
        .getNationality(this.utilsService
            .getCodeLanguage( this.localStorageService.getItem('language')['langId'])).map((nationality) => {
      this.nationalitiesList.push({ value: nationality.NATIONALITY_CODE, viewValue: nationality.NATIONALITY_DESC });
    });
    if (this.collaboratorInfo.nationality_id) {
      this.nationnality = this.nationalitiesList.filter(x => x.value === this.collaboratorInfo.nationality_id)[0].viewValue;
    }

  }

  async ngOnInit(): Promise<void> {

  }

  /**
   * @description update request training
   */
  update() {
    this.trainingRequest['application_id'] = this.trainingRequest.TrainingRequestKey.application_id;
    this.trainingRequest['collaborator_email'] = this.trainingRequest.TrainingRequestKey.collaborator_email;
    this.trainingRequest['email_address'] = this.trainingRequest.TrainingRequestKey.email_address;
    this.trainingRequest['request_code'] = this.trainingRequest.TrainingRequestKey.request_code;
    this.trainingService.updateTrainingRequest(this.trainingRequest).subscribe((data) => {
      this.utilsService.openSnackBar('accept training', 'close', 3000);
    });
  }

  /**
   * @description confirm training request
   */
  confirm() {
    this.trainingRequest.status_request = 'ACCEPT';
    this.update();

  }

  /**
   * @description reject training request
   */
  reject() {
    this.trainingRequest.status_request = 'REJECT';
    this.update();
  }

}
