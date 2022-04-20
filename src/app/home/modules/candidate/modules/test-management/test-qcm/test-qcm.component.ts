import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import {
  questionCurrentToNext,
  questionCurrentToPrevious,
  questionDisplayNewNext,
  questionDisplayNewPrevious,
  questionNextToCurrent,
  questionPreviousToCurrent,
} from '@shared/animations/animations';
import { MatCheckbox } from '@angular/material/checkbox';
import { UtilsService } from '@core/services/utils/utils.service';
import { TestService } from '@core/services/test/test.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-test-qcm',
  templateUrl: './test-qcm.component.html',
  styleUrls: ['./test-qcm.component.scss'],
  animations: [
    questionNextToCurrent,
    questionCurrentToPrevious,
    questionPreviousToCurrent,
    questionCurrentToNext,
    questionDisplayNewNext,
    questionDisplayNewPrevious,
  ]
})
export class TestQcmComponent implements OnInit, AfterContentChecked, AfterViewInit {
  colorCodes = {
    info: {
      color: 'firstColor'
    },
    warning: {
      color: 'secondColor',
    },
    alert: {
      color: 'thirdColor',
    }
  };
  env = environment.uploadFileApiUrl + '/show/';
  paddingTopSeconds = '';
  timeRing = '';
  index = 0;
  animationStateNext = false;
  animationStatePrevious = false;
  maxTime: number;
  timePassed = 0;
  answeredQuestions = [];
  timerInterval = null;
  timeLeft = this.maxTime;
  skippedQuestions = [];
  companyEmailAddress = '';
  paddingTopMinutes = '';
  checkedChoices = [];
  timerPerQuestionTimePassed = 0;
  sessionCode: string;
  applicationId: string;
  expiredDate: number;
  photo: string;
  languageId: string;
  @Input() isLoading = new BehaviorSubject<boolean>(true);
  @HostListener('window:beforeunload')
  disableCopyPaste: boolean;
  companyName: string;
  questionsList = [];
  choicesList = [];
  durationList = [];
  durationType: string;
  showExpiringPage = false;
  sessionName: string;
  showCongratulationPage = false;
  disableChoices =  false;
  enableNextButton = false;
  candidateEmail: string;
  editorOptions = { };
  code = '';
  fullName: string;
  experienceRequired: string;
  correctAnswersList = [];
  wrongAnswersList = [];
  blocQuestions: string[];
  questionsStats = [];
  constructor(
    private utilsService: UtilsService,
    private testService: TestService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {
    this.getSessionCode();
    this.getDataFromLocalStorage();
  }

  ngOnInit(): void {
    this.getConnectedUser();
    this.getQuestions();
    this.startTest();
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  /**
   * @description start test(change status link to false)
   */
  startTest() {
    const inviteCandidateSend = {
      company_email: this.companyEmailAddress,
      application_id: this.applicationId,
      session_code:  this.sessionCode ,
      candidate_email: this.candidateEmail,
      link_valid: false,
      expired_date: this.expiredDate
    };
    this.testService.updateInviteCandidates(inviteCandidateSend).subscribe((updated) => {
      console.log(updated, 'updated');
    });
  }
  /**************************************************************************
   * @description get data from local storage
   *************************************************************************/
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
  }

  ngAfterViewInit() {
    this.startTimer();
  }

  formatTimeLeftSeconds(time) {
    const seconds = time % 60;
    let stringSeconds = seconds.toString();
    if (seconds < 10) {
      stringSeconds = `0${seconds}`;
    }
    return `${stringSeconds}`;
  }

  formatTimeLeftMinutes(time) {
    return `${Math.floor(time / 60)}`;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRing = 'time-ring';
      if (this.timePassed < this.maxTime) {
        setTimeout(() => {
          if (this.timeLeft > 0) {
            if (this.timeLeft % 60 === 0) {
              this.paddingTopMinutes = `animation: lastMinuteAnimation 1000ms infinite`;
              this.paddingTopSeconds = `animation: secondsAnimation 1000ms infinite`;
            } else if (this.timeLeft % 60 === 59) {
              this.paddingTopMinutes = `animation: newMinuteAnimation 1000ms infinite`;
              this.paddingTopSeconds = `animation: secondsAnimation 1000ms infinite`;
            } else if (this.timeLeft === (this.maxTime - 1)) {
              this.paddingTopMinutes = ``;
              this.paddingTopSeconds = `animation: firstSecondAnimation 1000ms infinite`;
            } else {
              this.paddingTopMinutes = ``;
              this.paddingTopSeconds = `animation: secondsAnimation 1000ms infinite`;
            }
          } else {
            this.paddingTopMinutes = ``;
            this.paddingTopSeconds = 'animation: lastSecondAnimation 500ms; animation-iteration-count: 1;';
          }
        }, 1);
        this.timePassed++;
        this.timeLeft = this.maxTime - this.timePassed;
        this.testExpiredTime();
        this.setCircleDasharray();
      } else {
        this.paddingTopMinutes = ``;
        this.paddingTopSeconds = '';
      }
    }, 1000);
  }

  calculateTimeFraction() {
    return this.timeLeft / this.maxTime;
  }

  setCircleDasharray() {
    return `${(
      this.calculateTimeFraction() * 283
    ).toFixed(0)} 283`;
  }

  setRemainingPathColor(timeLeft) {
    const { alert, warning, info} = this.colorCodes;
    if (timeLeft <= this.maxTime / 4) {
      return alert.color;
    } else if (timeLeft <= this.maxTime / 2) {
      return warning.color;
    } else {
      return info.color;
    }
  }

  addIndex() {
    this.enableNextButton = false;
    this.disableChoices = false;
    this.editorOptions = { theme: 'vs-dark', language: this.questionsList[this.index + 1].language_tech, readOnly: true,  selectionClipboard: false};
    this.code = this.questionsList[this. index + 1].code;
    this.checkedChoices = this.answeredQuestions
      .map((oneQuestion) => oneQuestion.questionNumber)
      .includes(this.index + 2) ? [...this.answeredQuestions[this.answeredQuestions
      .findIndex((obj => obj.questionNumber === this.index + 2))].choiceCode] : [];
    if ((this.questionsList.length - 1) > this.index) {
      this.animationStateNext = true;
      setTimeout(() => {
        this.animationStateNext = false;
      }, 1);
      return this.index++;
    } else {
      return this.index;
    }
  }

  reduceIndex() {
    this.enableNextButton = false;
    this.disableChoices = false;
    this.editorOptions = { theme: 'vs-dark', language: this.questionsList[this.index - 1].language_tech};
    this.code = this.questionsList[this.index - 1].code;
    this.checkedChoices = this.answeredQuestions
      .map((oneQuestion) => oneQuestion.questionNumber)
      .includes(this.index) ? [...this.answeredQuestions[this.answeredQuestions
      .findIndex((obj => obj.questionNumber === this.index))].choiceCode] : [];

    if (this.index > 0) {
      this.animationStatePrevious = true;
      setTimeout(() => {
        this.animationStatePrevious = false;
        this.index = this.index - 1;
      }, 1);
      if (this.skippedQuestions.map((oneQuestion) => oneQuestion.questionNumber).includes(this.index)) {
        this.skippedQuestions.splice(this.index - 1, 1);
      }
        return this.index;
    } else {
      return this.index;
    }
  }

  showQuestion(index) {
    return index < 0 || index >= (this.questionsList.length) ? '' : `Q${index + 1}: ${this.questionsList[index].test_question_title}`;
  }
  showQuestionDesc(index) {
    return index < 0 || index >= (this.questionsList.length) ? '' : `Q${index + 1}: ${this.questionsList[index].test_question_desc}`;
  }

  checkBoxChange(checkBoxEvent: MatCheckbox) {
    if (checkBoxEvent.checked) {
      this.checkedChoices.push(checkBoxEvent.value);
    } else {
      this.checkedChoices.splice(this.checkedChoices.indexOf(checkBoxEvent.value), 1);
    }
  }

  radioButtonChange(radioButtonEvent) {
    this.checkedChoices = [radioButtonEvent.value];
  }

  getCheckedChoices(choiceCode) {
    let checkedChoice = false;
    this.checkedChoices.map((choice) => {
      if (choiceCode === choice) {
        checkedChoice = true;
      }
    });
    return checkedChoice;
  }

  getSessionCode() {
    this.utilsService.verifyCurrentRoute('/manager/test/session-list').subscribe((data) => {
      this.sessionCode = data.sessionCode;
      this.companyName = data.companyName;
      this.sessionName = data.sessionName;
      this.candidateEmail = data.candidateEmail;
      this.expiredDate = data.expiredDate;
    });
  }

  setAnsweredQuestions() {
    const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    if (this.checkedChoices.length > 0) {
      if (!this.answeredQuestions.map((oneQuestion) => oneQuestion.questionNumber).includes(this.index + 1)) {
        this.answeredQuestions.push({
          questionCode: this.questionsList[this.index].TestQuestionKey.test_question_code,
          questionMark: Number(this.questionsList[this.index].mark),
          choiceCode: this.checkedChoices,
          correctChoice: this.choicesList[this.index].correctChoice,
          correctAnswer: equals(this.choicesList[this.index].correctChoice, this.checkedChoices),
          questionNumber: this.index + 1,
        });
      } else {
        const questionIndex = this.answeredQuestions.findIndex((obj => obj.questionNumber === this.index + 1));
        this.answeredQuestions[questionIndex] = {
          questionCode: this.questionsList[this.index].TestQuestionKey.test_question_code,
          choiceCode: this.checkedChoices,
          correctChoice: this.choicesList[this.index].correctChoice,
          questionNumber: this.index + 1,
        };
      }
      const skippedQuestionIndex = this.skippedQuestions.findIndex((obj => obj.questionNumber === this.index + 1));
      if (this.skippedQuestions.findIndex((obj => obj.questionNumber === this.index + 1)) !== -1) {
        this.skippedQuestions.splice(skippedQuestionIndex, 1);
      }

    }

  }

  getQuestions() {
    this.isLoading.next(true);
    this.testService.getSession(`?session_code=${this.sessionCode}`).subscribe( (session) => {
      this.blocQuestions = session[0].TestSessionKey.block_questions_code.split(',');
    this.testService.getSessionInfo(
      `?company_email=${
        this.companyEmailAddress}&application_id=${
        this.utilsService.getApplicationID('SERVICIMA')}&session_code=${
        this.sessionCode}`).subscribe((oneSession) => {
          this.languageId = oneSession[0]['language_id'];
          this.testService.getLevel(`?test_level_code=${oneSession[0].level_code}`).subscribe( (level) => {
            this.experienceRequired = level[0].test_level_title;
          });
          this.disableCopyPaste = oneSession[0].copy_paste;
      this.testService
        .getSessionQuestion(
          `?company_email=${
            this.companyEmailAddress}&application_id=${
            this.utilsService.getApplicationID('SERVICIMA')}&session_code=${
            this.sessionCode}`).subscribe((sessionQuestions) => {
        sessionQuestions.map((oneSessionQuestion, index) => {
          this.testService
            .getQuestion(`?test_question_code=${oneSessionQuestion.TestSessionQuestionsKey.test_question_code}`)
            .subscribe((question) => {
            this.testService.getChoices(`?test_question_code=${question[0].TestQuestionKey.test_question_code}`)
              .subscribe((choices) => {
                const correctChoice = [];
                choices.map( (oneChoice) => {
                  if (oneChoice.correct_choice === 'True') {
                    correctChoice.push(oneChoice.TestChoicesKey.test_choices_code);
                  }
                });
                this.questionsList.push(question[0]);
                this.editorOptions = {
                  theme: 'vs-dark',
                  language: question[0].language_tech,
                  readOnly: true,
                  contextmenu: false
                };
                this.code = this.questionsList[0].code;
                this.choicesList.push({
                  questionCode: oneSessionQuestion.TestSessionQuestionsKey.test_question_code,
                  questionType: question[0].question_type,
                  choices,
                  correctChoice
                });
                this.durationType = oneSession[0].test_session_timer_type;
                if (oneSession[0].test_session_timer_type === 'time_overall') {
                  this.maxTime = Number(oneSession[0].test_session_time);
                } else {
                  this.durationList.push(Number(question[0].duration));
                  this.maxTime = this.durationList[0];
                }
              });

            this.isLoading.next(false);
          });
        });
      });
    });
    });
  }
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];
            this.photo = userInfo['company'][0].photo;
            this.fullName = userInfo['user'][0].first_name + ' ' + userInfo['user'][0].last_name;
          }
        });
  }

  checkBoxChecked(checkBoxEvent: MatCheckbox) {
    let checkedChoice = false;
    this.checkedChoices.map(oneCheckedChoice => {
      if (oneCheckedChoice === checkBoxEvent.value) {
        checkedChoice = true;
      }
    });
    return checkedChoice;
  }
  setSkippedQuestions() {
    if (!this.answeredQuestions.map((oneQuestion) => oneQuestion.questionNumber).includes(this.index + 1)) {
      this.skippedQuestions.push({
        questionCode: this.questionsList[this.index].TestQuestionKey.test_question_code,
        questionNumber: this.index + 1
      });
  }
  }
  initTimerParams(maxTime) {
    if (this.durationType === 'time_per_question') {
      this.timerPerQuestionTimePassed += this.timePassed;
      this.maxTime = maxTime;
      this.timePassed = 0;
      this.timeLeft = maxTime;
    }
  }
  testExpiredTime() {
    if (this.timeLeft === 0) {
      if (this.durationType === 'time_per_question') {
        if (this.index + 1 < this.questionsList.length) {
          this.disableChoices = true;
          this.enableNextButton = true;
        } else {
          this.finishTest();
        }
        this.skippedQuestions.push({
          questionCode: this.questionsList[this.index].TestQuestionKey.test_question_code,
          questionNumber: this.index + 1
        });
      } else if (this.durationType === 'time_overall') {
        this.showExpiringPage = true;
    }
    }
  }
  finishTest() {
    console.log('correct answers list', this.correctAnswersList);
    const candidateResultCode = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-CANDIDATE-RESULT`;
    const newTestResult = {
      company_email: this.companyEmailAddress,
      application_id:  this.utilsService.getApplicationID('SERVICIMA'),
      session_name: this.sessionName,
      candidate_result_code: candidateResultCode,
      final_result: ((this.correctAnswersList.length * 100) / this.questionsList.length).toFixed() + '%',
      full_name: this.fullName,
      time: this.durationType === 'time_overall' ? this.timePassed : this.timerPerQuestionTimePassed,
      answered_questions: this.answeredQuestions.length,
      total_questions: this.questionsList.length,
    };
    console.log('test result object=', newTestResult);
    this.testService.addTestCandidateResult(newTestResult).subscribe( (testResult) => {
      console.log('added', testResult);
            this.showCongratulationPage = true;
    });
  }

  /**
   * @description: back to home
   */
  backToHome() {
    this.router.navigate(['/candidate']);
  }
  onKeyDown(event) {
    if (this.disableCopyPaste) {
      const { keyCode, ctrlKey, metaKey} = event;
      if ((keyCode === 17 || keyCode === 67) && (metaKey || ctrlKey)) {
        event.preventDefault();
      }
    }
  }
  sendReport() {
    const reportData = {
      fullName: this.fullName,
      sessionName: this.sessionName,
      experienceRequired: this.experienceRequired,
      companyName: this.companyName,
      duration: this.durationType === 'time_overall' ? this.timePassed : this.timerPerQuestionTimePassed,
      skippedQuestionTotal: this.skippedQuestions.length,
      correctAnswerPercentage: {
        exact: Number((this.correctAnswersList.length * 100) / this.questionsList.length),
        display: Number(((this.correctAnswersList.length * 100) / this.questionsList.length).toFixed())
      },
      wrongAnswerPercentage: {
        display: Number(((this.wrongAnswersList.length * 100) / this.questionsList.length).toFixed()),
        exact: Number((this.wrongAnswersList.length * 100) / this.questionsList.length), },
      skippedAnswerPercentage: {
        display: Number(((this.skippedQuestions.length * 100) / this.questionsList.length).toFixed()),
        exact: Number((this.skippedQuestions.length * 100) / this.questionsList.length), },
      questionsStats: this.questionsStats,
    };
    console.log(reportData);
  }
  correctAnswerPercentage() {
    this.correctAnswersList = [];
    this.answeredQuestions.map( (oneQuestion) => {
      if (oneQuestion.correctAnswer) {
        this.correctAnswersList.push(oneQuestion);
      }
    });
    return (this.correctAnswersList.length * 100) / this.questionsList.length;
  }
  wrongAnswerPercentage() {
    this.wrongAnswersList = [];
    this.answeredQuestions.map( (oneQuestion) => {
      if (!oneQuestion.correctAnswer) {
        this.wrongAnswersList.push(oneQuestion);

      }
    });
    return (this.wrongAnswersList.length * 100) / this.questionsList.length;
  }
  getQuestionsStats() {
    this.questionsStats = [];
    this.correctAnswerPercentage();
    this.wrongAnswerPercentage();
      this.blocQuestions.map( (oneBlocQuestionsCode, index) => {
        let technologyTitle = '';
        let sumTotal = 0;
        let sumCorrect = 0;
        let sumWrong = 0;
        let sumSkipped = 0;
        let achievedPts = 0;
        let totalPts = 0;
        this.testService.getQuestionBloc(`?test_question_bloc_code=${oneBlocQuestionsCode}`).subscribe( (blocQuestion) => {
          this.testService.getTechnologies(`?test_technology_code=${blocQuestion['results'][0].TestQuestionBlocKey.test_technology_code}`)
            .subscribe( (technology) => {
              technologyTitle = technology[0].technology_title;
          this.testService.getSessionQuestion(`?session_code=${this.sessionCode}&bloc_question_code=${oneBlocQuestionsCode}`)
            .subscribe((sessionQuestions) => {
              this.questionsList.map( (oneQuestion ) => {
                if (oneQuestion.TestQuestionKey.test_question_bloc_code === oneBlocQuestionsCode) {
                  sumTotal += Number(oneQuestion.mark);
                  totalPts += Number(oneQuestion.mark);

                }
              });
              sessionQuestions.map((oneSessionQuestion) => {
                this.correctAnswersList.map( (correctAnswer) => {
                  if (correctAnswer.questionCode === oneSessionQuestion.TestSessionQuestionsKey.test_question_code) {
                    sumCorrect += Number(correctAnswer.questionMark);
                    achievedPts += Number(correctAnswer.questionMark);
                  }
                });
                this.wrongAnswersList.map( (wrongAnswer) => {
                    if (wrongAnswer.questionCode === oneBlocQuestionsCode) {
                      sumWrong += Number(wrongAnswer.questionMark);
                    }
                });
                sumSkipped = sumTotal - (sumWrong + sumCorrect);

              });
              this.questionsStats.push( {
                technologyTitle,
                questionsStats:
                  {
                    skippedPercentage: Number(((sumSkipped * 100) / sumTotal).toFixed()),
                    wrongPercentage: Number(((sumWrong * 100) / sumTotal).toFixed()),
                    correctPercentage: Number(((sumCorrect * 100) / sumTotal).toFixed()),
                  },
                questionMark: {
                  totalPts,
                  achievedPts,
                  percentagePts: Number(((achievedPts * 100) / totalPts).toFixed()),
                }
              });
            });
        });
        });
      });
  }
}
