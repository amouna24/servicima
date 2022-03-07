import { Component, OnInit } from '@angular/core';
import { blocQuestionsAppearance } from '@shared/animations/animations';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environment/environment';
import { MatCheckbox } from '@angular/material/checkbox';
import { ITestSessionModel } from '@shared/models/testSession.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import { BlocListModalComponent } from '../bloc-list-modal/bloc-list-modal.component';

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
  availableBlocQuestionsList: ITestQuestionBlocModel[] = [];
  otherBlocQuestionsList: ITestQuestionBlocModel[] = [];
  imageUrl: string;
  selectedBlocs = [];
  constructor(
    private testService: TestService,
    private userService: UserService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.getConnectedUser();
    this.showVertical = true;
    this.imageUrl = `${environment.uploadFileApiUrl}/image/`;
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
        resBlocQuestions['results'].map( (oneBloc: ITestQuestionBlocModel) => {
          if (oneBloc.free) {
            this.availableBlocQuestionsList.push(oneBloc);
          } else {
            this.otherBlocQuestionsList.push(oneBloc);
          }
        });
    });
  }
  openDescriptionDialog(blocQuestion, available: string) {
    const dialogRef = this.dialog.open(BlocListModalComponent, {
      height: '344px',
      width: '607px',
      data: {
        bloc_title: blocQuestion.test_question_bloc_title,
        bloc_image: blocQuestion.image,
        bloc_desc: blocQuestion.test_question_bloc_desc,
        bloc_free: blocQuestion.free,
        bloc_price: blocQuestion.price,
        pack_type: available,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  checkSelectedBloc(blocCode) {
    let checked = false;
    this.selectedBlocs.map( (oneBloc) => {
        if (oneBloc === blocCode) { checked  = true; }
    });
    return checked;
  }
  addRemoveSelectedBloc(event: MatCheckbox, blocQuestionCode: string) {
    if (event.checked) {
      this.selectedBlocs.push(blocQuestionCode);
    } else {
      this.selectedBlocs.splice(this.selectedBlocs.indexOf(blocQuestionCode), 1);
    }
  }
  moveToInfoSessionPage() {
         const queryObject = {
        selectedBlocs: this.selectedBlocs,
      };
      this.utilsService.navigateWithQueryParam('/manager/test/session-info', queryObject);
  }
}
