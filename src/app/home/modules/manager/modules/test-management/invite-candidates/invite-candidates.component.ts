import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from '@core/services/modal/modal.service';
import { ReplaySubject } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import * as _ from 'lodash';
import { UtilsService } from '@core/services/utils/utils.service';

import { ChooseCandidatesComponent } from './choose-candidates/choose-candidates.component';

@Component({
  selector: 'wid-invite-candidates',
  templateUrl: './invite-candidates.component.html',
  styleUrls: ['./invite-candidates.component.scss']
})
export class InviteCandidatesComponent implements OnInit {
  /**************************************************************************
   *  Initialise destroyed
   *************************************************************************/
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  companyEmailAddress: string;
  listCandidates: any;
  mode: string;
  sessionCode: string;

  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private utilsService: UtilsService
  ) {
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.getData();
    this.modalService.registerModals(
      { modalName: 'inviteCandidate', modalComponent: ChooseCandidatesComponent});
    this.getConnectedUser();
    this.getAllUsers();
  }

  /**************************************************************************
   *  get all candidates with specific company
   *************************************************************************/
  getAllUsers() {
    this.userService.getAllUsers(`?company_email=${this.companyEmailAddress}&user_type=CANDIDATE`).subscribe((data) => {
      data['results'].map((candidate) => {
        candidate['email_address'] = candidate['userKey']['email_address'];
        candidate['fullName'] = candidate['first_name'] + ' ' + candidate['last_name'];
      });
      this.listCandidates = data['results'];
      this.listCandidates = _.orderBy(this.listCandidates, [user => user.fullName.toLowerCase()], ['asc']);

    });
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  /**
   * @description Open invite candidate
   */
  inviteCandidates() {
    this.modalService.displayModal('inviteCandidate', this.listCandidates,
      '900px', '580px')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async (res) => {
        if (res) {
          console.log(res, 'res');
        }
      }, (error => {
        console.error(error);
      }));

  }

  getData() {
    this.utilsService.verifyCurrentRoute('/manager/test/session-list').subscribe((data) => {
      this.sessionCode = data.sessionCode;
      this.mode = data.mode;
    });
  }
}
