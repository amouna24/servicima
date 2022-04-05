import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { TrainingService } from '@core/services/training/training.service';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';

import { DetailsInvitationComponent } from '../details-invitation/details-invitation.component';

@Component({
  selector: 'wid-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {
  @Input() data: any;
  @Input() status: string;
  @Output() acceptInvite = new EventEmitter<any>();
  @Output() ignoreInvite = new EventEmitter<any>();
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
  ignore() {
      this.ignoreInvite.emit(this.data);
  }
  accept() {
      this.acceptInvite.emit(this.data);
  }
  showDetails() {
      this.modalService.displayModal('detailsInviteCollaborator', {
          training: this.data,
          sessions: this.sessionList
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
        this.trainingService.getTrainingSession(`?training_code=${this.data.TrainingInviteCollaboratorKey.training_code}`).subscribe((sessions) => {
           this.sessionList = sessions['results'];
        });
  }

}
