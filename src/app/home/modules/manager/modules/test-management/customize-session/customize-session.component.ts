import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { colorList } from '@shared/statics/testTechnologiesColorList';
import { UtilsService } from '@core/services/utils/utils.service';
import { Color } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { ITestSessionQuestionModel } from '@shared/models/testSessionQuestion.model';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
@Component({
  selector: 'wid-customize-session',
  templateUrl: './customize-session.component.html',
  styleUrls: ['./customize-session.component.scss']
})
export class CustomizeSessionComponent implements OnInit {
  selectedBlocArray = [];
  blocTitlesAndPointsList = [];
  totalPoints = 0;
  options = { };
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartColors: Color[] = [];
  selectedBlocsStringFormat: string;
  technologiesList = [];
  sessionCode: string;
  applicationId: string;
  companyEmailAddress: string;
  mode: string;
  showblocQuestionsList = [];
  constructor(
    private testService: TestService,
    private utilsService: UtilsService,
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService,
  ) {
    this.getChartParams();
    this.getSelectedBlocArray();
  }

  blocQuestionsList: Array<{
    questionDetails: ITestQuestionModel,
    bloc_title: string,
    technology?: string
    color: string
  }> = [];
  oldSessionQuestionList: Array<{
    questionDetails: ITestQuestionModel,
    bloc_title: string,
    technology?: string
    color: string
  }> = [];
  sessionQuestionsList: Array<{
  questionDetails: ITestQuestionModel,
  bloc_title: string,
  technology?: string
  color: string
}> = [];
  searchField = '';
  selectSearchField = '';

  async ngOnInit(): Promise<void> {
    this.getDataFromLocalStorage();
    this.getConnectedUser();
    await this.getBlocQuestionsData();
    this.getBlocTitleAndPoints();
    this.getTechnologies();
  }
  getBlocQuestionsData() {
    this.testService.getQuestion(`?test_question_bloc_code=${this.selectedBlocsStringFormat}`).subscribe((resNode) => {
      const quartLength = Math.ceil(resNode.length / 3);
      resNode.map((resOneNode, index) => {
        let addSessionQuestion = false;
        this.testService
          .getQuestionBloc(`?test_question_bloc_code=${resOneNode.TestQuestionKey.test_question_bloc_code}`)
          .subscribe((resBlocQuestion) => {
            this.testService
              .getSessionQuestion(`?company_email=${
                this.companyEmailAddress}&application_id=${
                this.applicationId}&session_code=${
                this.sessionCode}`)
              .subscribe( (questionsList) => {
                if (questionsList['msg_code'] !== '0004') {
                  questionsList.forEach( (oneQuestion) => {
                    if (oneQuestion.TestSessionQuestionsKey.test_question_code === resOneNode.TestQuestionKey.test_question_code) {
                      addSessionQuestion = true;
                    }
                  });
                          if (addSessionQuestion) {
                          this.sessionQuestionsList.push({
                            questionDetails: resOneNode,
                            bloc_title: resBlocQuestion['results'][0]?.test_question_bloc_title,
                            color: colorList[index]
                          });
                        } else {
                          this.testService
                            .getTechnologies(`?test_technology_code=${resBlocQuestion['results'][0].TestQuestionBlocKey.test_technology_code}`)
                            .subscribe((oneBlocItem) => {
                              this.blocQuestionsList.push({
                                questionDetails: resOneNode,
                                bloc_title: resBlocQuestion['results'][0]?.test_question_bloc_title,
                                technology: oneBlocItem[0].technology_title,
                                color: colorList[index]
                              });
                            });
                        }
                  this.oldSessionQuestionList = [...this.sessionQuestionsList];
                } else {
                  if
                  (this.sessionQuestionsList.length <= quartLength - 1) {
                    this.sessionQuestionsList.push({
                      questionDetails: resOneNode,
                      bloc_title: resBlocQuestion['results'][0]?.test_question_bloc_title,
                      color: colorList[index]
                    });
                  } else {
                    this.testService
                      .getTechnologies(`?test_technology_code=${resBlocQuestion['results'][0].TestQuestionBlocKey.test_technology_code}`)
                      .subscribe((oneBlocItem) => {
                        this.blocQuestionsList.push({
                          questionDetails: resOneNode,
                          bloc_title: resBlocQuestion['results'][0]?.test_question_bloc_title,
                          technology: oneBlocItem[0].technology_title,
                          color: colorList[index]
                        });
                      });
                  }
                }

              });

            this.totalPoints += Number(resOneNode.mark);
          });
      });
      this.showblocQuestionsList = this.blocQuestionsList;
    });
  }
  dragAndDrop(event: CdkDragDrop<Array<{ questionDetails: ITestQuestionModel; bloc_title: string; color: string }>, any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('current event', event),
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  getLevel(levelCode) {
    switch (levelCode) {
      case '1' : {
        return 1;
      }
      case '2' : {
        return 2;
      }
      case '3' : {
        return 3;
      }
      default:
        return 4;
    }
  }
  getColors(index) {
    switch (index) {
      case this.selectedBlocArray[0]: {
        return colorList[0];
      }
      case this.selectedBlocArray[1]:
        return colorList[1];
      case this.selectedBlocArray[2]:
        return colorList[2];
      case this.selectedBlocArray[3]:
        return colorList[3];
      case this.selectedBlocArray[4]:
        return colorList[4];
      case this.selectedBlocArray[5]:
        return colorList[5];
    }
  }
  addRandomQuestion() {
    const randomNumber = Math.floor(Math.random() * this.showblocQuestionsList.length);
    this.sessionQuestionsList.push(this.showblocQuestionsList[randomNumber]);
    this.showblocQuestionsList.splice(randomNumber, 1);
  }
  setDuration(duration) {
    const displayedHours = Math.floor(duration / 3600) <= 9 ? '0' + Math.floor(duration / 3600) : Math.floor(duration / 3600);
    const displayedMinutes = Math.floor(duration % 3600 / 60) <= 9 ? '0' + Math.floor(duration / 60) : Math.floor(duration / 60);
    const displayedSeconds = Math.floor(duration % 3600 % 60) <= 9 ? '0' + Math.floor(duration % 60) : Math.floor(duration % 60);
    return displayedHours !== 0 ? displayedMinutes + ':' + displayedSeconds : displayedHours + ':' + displayedMinutes + ':' + displayedSeconds;
  }
  getBlocTitleAndPoints() {
    this.selectedBlocArray.forEach((blocQuestionCode) => {
      let totalPoints = 0;
      this.testService.getQuestionBloc(`?test_question_bloc_code=${blocQuestionCode}`)
        .subscribe((resNode) => {
          this.testService
            .getQuestion(`?test_question_bloc_code=${blocQuestionCode}`)
            .subscribe((resQuestion) => {
              resQuestion.map((resOneQuestion) => {
                totalPoints += Number(resOneQuestion.mark);
              });
              this.blocTitlesAndPointsList.push({
                title: resNode['results'][0].test_question_bloc_title,
                points: totalPoints,
                code: blocQuestionCode
              });
            });
        });
    });
  }
  getSelectedBlocArray() {
    this.utilsService.verifyCurrentRoute('/manager/test/session-list').subscribe((data) => {
      this.selectedBlocsStringFormat = data.selectedBlocs;
      this.sessionCode = data.sessionCode;
      this.selectedBlocArray = data.selectedBlocs.split(',');
      this.mode = data.mode;
    });
  }
  getChartPercentage() {
    return this.blocTitlesAndPointsList.map((oneBloc) => {
      return Number((oneBloc.points * 100) / this.totalPoints);
    });
  }
  getChartTitle() {
    return this.blocTitlesAndPointsList.map((oneBloc) => {
      return oneBloc.title;
    });
  }
  getChartParams() {
    this.doughnutChartType = 'doughnut';
    this.options = {
      cutoutPercentage: 70,
      cutout: 70,
      legend: { display: false}
    };
    this.doughnutChartColors = [{
      backgroundColor: colorList
    }];
  }
  getTechnologies() {
    this.selectedBlocArray.map((oneItem) => {
      this.testService.getQuestionBloc(`?test_question_bloc_code=${oneItem}`)
        .subscribe((resBlocQuestion) => {
          this.testService
            .getTechnologies(`?test_technology_code=${resBlocQuestion['results'][0].TestQuestionBlocKey.test_technology_code}`)
            .subscribe((oneBlocItem) => {
              this.technologiesList.push(oneBlocItem[0].technology_title);
            });
        });
    });
  }
  getTotalTime() {
    let sumTime = 0;
    this.sessionQuestionsList.map( (oneItem) => {
      sumTime += Number(oneItem.questionDetails.duration);
    });
    const displayedHours = Math.floor(sumTime / 3600) <= 9 ? '0' + Math.floor(sumTime / 3600) : Math.floor(sumTime / 3600);
    const displayedMinutes = Math.floor(sumTime % 3600 / 60) <= 9 ? '0' + Math.floor(sumTime / 60) : Math.floor(sumTime / 60);
    const displayedSeconds = Math.floor(sumTime % 3600 % 60) <= 9 ? '0' + Math.floor(sumTime % 60) : Math.floor(sumTime % 60);
    return  {
      time: displayedHours !== '00' ? displayedHours :  displayedMinutes !== '00' ? displayedMinutes : displayedSeconds,
      type: sumTime < 60 ? 'sec'  : sumTime < 3600 ? 'min' : 'h',
    };
  }
  getTotalPoints(): number {
    let totalPoint = 0;
    this.sessionQuestionsList.forEach( (oneQuestion) => {
      totalPoint += Number(oneQuestion.questionDetails.mark);
    });
    return totalPoint;
  }
  getBlocTotalPoints(blocQuestionsCode: string) {
    let totalPoints = 0;
    this.sessionQuestionsList.forEach( (question) => {
      if (question.questionDetails.TestQuestionKey.test_question_bloc_code === blocQuestionsCode) {
        totalPoints += Number(question.questionDetails.mark);
      }
    });
    return totalPoints;
  }
  saveAndMoveToTimerPage() {
    this.addNewQuestions();
    this.deleteOldQuestions();
    this.updateSessionTime();
      const queryObject = {
        selectedBlocs: this.selectedBlocArray,
        totalQuestion: this.sessionQuestionsList.length,
        totalTime: this.getTotalTime().time,
        totalTimeType: this.getTotalTime().type,
        totalPoints: this.getTotalPoints(),
        sessionCode: this.sessionCode,
        mode: this.mode,
      };
      this.utilsService.navigateWithQueryParam('/manager/test/session-timer', queryObject);
  }
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
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
  backToPreviousPage() {
    const queryObject = {
      sessionCode: this.sessionCode,
      selectedBlocs: this.selectedBlocArray,
      mode: this.mode
    };
    this.utilsService.navigateWithQueryParam('/manager/test/session-info', queryObject);
  }
  addNewQuestions() {
    let addedQuestion = 1;
    this.sessionQuestionsList.map( (oneQuestion, index) => {
      let addQuestion = true;
      const testSessionObject: ITestSessionQuestionModel = {
        application_id: oneQuestion.questionDetails.TestQuestionKey.application_id,
        company_email: this.companyEmailAddress,
        session_code: this.sessionCode,
        bloc_question_code: oneQuestion.questionDetails.TestQuestionKey.test_question_bloc_code,
        test_session_questions_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SESSION-QUESTION`,
        test_question_code: oneQuestion.questionDetails.TestQuestionKey.test_question_code,
      };
      this.oldSessionQuestionList.map( (oneOldQuestion) => {
        if (oneOldQuestion.questionDetails.TestQuestionKey.test_question_code === oneQuestion.questionDetails.TestQuestionKey.test_question_code) {
          addQuestion = false;
        }
      });
      if (addQuestion) {
        this.testService.addTestSessionQuestion(testSessionObject).subscribe( (result) => {
          addedQuestion += 1;
        });
      }
    });
  }
  deleteOldQuestions() {
    this.oldSessionQuestionList.map( (oldQuestion) => {
      let deleteQuestion = true;
      this.sessionQuestionsList.map( (oneQuestion) => {
        if (oldQuestion.questionDetails.TestQuestionKey.test_question_code === oneQuestion.questionDetails.TestQuestionKey.test_question_code) {
          deleteQuestion = false;
        }
      });
      if (deleteQuestion) {
        this.testService
          .getSessionQuestion(`?test_question_code=${
            oldQuestion.questionDetails.TestQuestionKey.test_question_code}&session_code=${
            this.sessionCode}&company_email=${
            this.companyEmailAddress}&application_id=${
            this.applicationId}`)
          .subscribe( (question) => {
            this.testService.deleteSessionQuestion(question[0]._id).subscribe( (oneQuestion) => {
              console.log('deleted question', oneQuestion);
            });
          });
      }
    });
  }
  updateSessionTime() {
    let sumTime = 0;
    this.testService
      .getSessionInfo(`?company_email=${
        this.companyEmailAddress}&application_id=${
        this.applicationId}&session_code=${
        this.sessionCode}`)
      .subscribe((sessionInfo) => {
        if (sessionInfo[0].test_session_timer_type === 'time_per_question') {
          this.sessionQuestionsList.map((oneQuestion) => sumTime += Number(oneQuestion.questionDetails.duration));
          const newSessionObject = sessionInfo[0];
          newSessionObject.session_code = newSessionObject.TestSessionInfoKey.session_code;
          newSessionObject.test_session_info_code = newSessionObject.TestSessionInfoKey.test_session_info_code;
          newSessionObject.company_email = this.companyEmailAddress;
          newSessionObject.application_id = newSessionObject.TestSessionInfoKey.application_id;
          newSessionObject.test_session_time = sumTime;
          this.testService.updateSessionInfo(newSessionObject).subscribe(( newInfo) => {
            console.log('time updated to', sumTime);
          });
        }
      });
  }

  updateAvailableQuestions() {
    this.sessionQuestionsList.map( (oneSession) => {
      this.blocQuestionsList.map((oneBloc, index) => {
        if (oneSession === oneBloc) {
          this.blocQuestionsList.splice(index, 1);
        }
      });
    });
    this.showblocQuestionsList = this.blocQuestionsList.filter( (data) => {
      const selectField = data.questionDetails.test_question_title;
      return selectField?.toLowerCase().includes(this.searchField.toLowerCase());
    }).filter( (dataSelect) => {
      const selectField = dataSelect.technology;
      return selectField?.toLowerCase().includes(this.selectSearchField.toLowerCase());
    });
    console.log('show bloc questions', this.showblocQuestionsList);
  }
}
