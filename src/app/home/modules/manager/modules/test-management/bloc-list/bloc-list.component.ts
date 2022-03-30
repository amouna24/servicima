import { Component, Input, OnInit } from '@angular/core';
import { blocQuestionsAppearance } from '@shared/animations/animations';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environment/environment';
import { MatCheckbox } from '@angular/material/checkbox';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { BehaviorSubject } from 'rxjs';

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
  searchField = '';
  selectSearchField: string;
  applicationId: string;
  technologiesList = [];
  sessionCode: string;
  isLoading = new BehaviorSubject<boolean>(false);
  constructor(
    private testService: TestService,
    private userService: UserService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.getSelectedBlocArray();
    this.getConnectedUser();
    this.getDataFromLocalStorage();
    this.getTechnologies();
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
    this.isLoading.next(true);
    this.testService
      .getQuestionBloc(
        `?company_email=ALL&application_id=${this.utilsService.
        getApplicationID('SERVICIMA')}&language_id=${this.localStorageService.getItem('language').langCode}`)
      .subscribe( (resBlocQuestions) => {
        resBlocQuestions['results'].map( (oneBloc: ITestQuestionBlocModel, index) => {
          this.testService.getQuestion(`?test_question_bloc_code=${oneBloc.TestQuestionBlocKey.test_question_bloc_code}`).subscribe( (questions) => {
            if (!questions['msg_code']) {
              if (oneBloc.free) {
                this.availableBlocQuestionsList.push(oneBloc);
                this.isLoading.next(false);
              } else {
                this.otherBlocQuestionsList.push(oneBloc);
              }
            }
            if ( (index + 1) === resBlocQuestions['results'].length) {
              this.isLoading.next(false);
            }
          });

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
    let checked;
    this.selectedBlocs.map( (oneBloc) => {
        if (oneBloc === blocCode) { checked  = true; }
    });
    return checked;
  }
  selectBlocFromCard(blocQuestionCode: string) {
    if (this.selectedBlocs.map((oneQuestion) => oneQuestion).includes(blocQuestionCode)) {
      this.selectedBlocs.splice(this.selectedBlocs.indexOf(blocQuestionCode), 1);
    } else {
      this.selectedBlocs.push(blocQuestionCode);
    }
  }
  moveToInfoSessionPage() {
         const queryObject = {
        selectedBlocs: this.selectedBlocs,
        sessionCode: this.sessionCode,
        mode: 'create',
         };
      this.utilsService.navigateWithQueryParam('/manager/test/session-info', queryObject);
  }
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
  }
  getTechnologies() {
    this.technologiesList.push({
      title: 'All',
      code: '',
    });
          this.testService
            .getTechnologies(`?company_email=ALL&application_id=${this.applicationId}`)
            .subscribe((technoList) => {
              technoList.map( (oneTechno) => {
                this.technologiesList.push({
                  title: oneTechno.technology_title,
                  code: oneTechno.TestTechnologyKey.test_technology_code,
                });
              });
            });
  }
  cancelSelectedBlocs() {
    this.selectedBlocs = [];
  }
  getSelectedBlocArray() {
    this.utilsService.verifyCurrentRoute('/manager/test/bloc-list', true).subscribe( (data) => {
      this.selectedBlocs = data.selectedBlocs.split(',');
      this.sessionCode = data.sessionCode;
    });
  }
}
