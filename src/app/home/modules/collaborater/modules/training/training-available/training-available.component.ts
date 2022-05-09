import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITraining } from '@shared/models/training.model';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';
import { ReplaySubject } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { TrainingService } from '@core/services/training/training.service';
import { takeUntil } from 'rxjs/operators';

import { DetailsInvitationComponent } from '../details-invitation/details-invitation.component';

@Component({
  selector: 'wid-training-available',
  templateUrl: './training-available.component.html',
  styleUrls: ['./training-available.component.scss']
})
export class TrainingAvailableComponent implements OnInit {

  @Input() training: ITraining;
  sessionList: ITrainingSessionWeek[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
      private modalService: ModalService,
      private trainingService: TrainingService
  ) { }

  ngOnInit(): void {
    this.getSessionWeeks();
    this.modalService.registerModals(
        { modalName: 'detailsInviteCollaborator', modalComponent: DetailsInvitationComponent});
  }
  showDetails() {
    this.modalService.displayModal('detailsInviteCollaborator', {
          training: this.training,
          sessions: this.sessionList,
          apply: true,
        },
        '520px', '600px')
        .pipe(takeUntil(this.destroyed$))
        .subscribe(async (res) => {
          if (res) {
            console.log(res, 'res');
          }
        }, (error => {
          console.error(error);
        }));
  }
  getSessionWeeks() {
    this.trainingService.getTrainingSession(`?training_code=${this.training.TrainingKey.training_code}`).subscribe((sessions) => {
      this.sessionList = sessions['results'];
    });
  }

}
