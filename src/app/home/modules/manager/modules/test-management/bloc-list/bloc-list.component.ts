import { Component, OnInit } from '@angular/core';
import { blocQuestionsAppearance } from '@shared/animations/animations';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-bloc-list',
  templateUrl: './bloc-list.component.html',
  styleUrls: ['./bloc-list.component.scss'],
  animations: [
    blocQuestionsAppearance,
  ],
})
export class BlocListComponent implements OnInit {
  showVertical: boolean;
  displayingIcon: string;
  listIcon: string;
  gridIcon: string;
  companyEmailAddress: string;
  blocQuestionsList: ITestQuestionBlocModel[];
  constructor(
    private testService: TestService,
    private userService: UserService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.getConnectedUser();
    this.showVertical = true;
    this.gridIcon = 'assets/icons/tabler-icon-grid-dots.svg';
    this.listIcon = 'assets/icons/tabler-icon-list-details.svg';
    this.displayingIcon = this.listIcon;
    this.getBlocQuestions();
  }
  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];          }
        });
  }

  changeDisplaying() {
    this.showVertical = !this.showVertical;
    this.displayingIcon = this.displayingIcon === this.listIcon ? this.gridIcon : this.listIcon;
  }
  getBlocQuestions() {
    this.testService
      .getQuestionBloc(
        `?company_email=${this.companyEmailAddress}&application_id=${this.utilsService.
        getApplicationID('SERVICIMA')}`)
      .subscribe( (resBlocQuestions) => {
        console.log('bloc lists=', resBlocQuestions['results']);
      this.blocQuestionsList = resBlocQuestions['results'];
    });
  }
}
