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
  paddingTopSeconds = '';
  timeRing = '';
  infoCircleClass = 'deg 90';
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
  finalResult = 0;

  constructor(
    private utilsService: UtilsService,
    private testService: TestService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService
  ) {
    this.getSessionCode();
  }

  ngOnInit(): void {
    this.getConnectedUser();
    this.getQuestions();
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
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
    this.checkedChoices = this.answeredQuestions[this.index + 1] ? [...this.answeredQuestions[this.index + 1].choiceCode] : [];
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
    this.checkedChoices = this.answeredQuestions[this.index - 1] ? [...this.answeredQuestions[this.index - 1].choiceCode] : [];
    if (this.index > 0) {
      this.animationStatePrevious = true;
      setTimeout(() => {
        this.animationStatePrevious = false;
        this.index = this.index - 1;
      }, 1);
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
    });
  }

  setAnsweredQuestions() {
    if (this.checkedChoices.length > 0) {
      if (!this.answeredQuestions.map((oneQuestion) => oneQuestion.questionNumber).includes(this.index + 1)) {
        this.answeredQuestions.push({
          questionCode: this.questionsList[this.index].TestQuestionKey.test_question_code,
          questionMark: Number(this.questionsList[this.index].mark),
          choiceCode: this.checkedChoices,
          correctChoice: this.choicesList[this.index].correctChoice,
          questionNumber: this.index + 1,
        });
        if (this.answeredQuestions.length === this.questionsList.length) {
        }
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
      this.skippedQuestions.splice(skippedQuestionIndex, 1);

    }

  }

  getQuestions() {
    this.isLoading.next(true);
    this.testService.getSessionInfo(
      `?company_email=${
        this.companyEmailAddress}&application_id=${
        this.utilsService.getApplicationID('SERVICIMA')}&session_code=${
        this.sessionCode}`).subscribe((oneSession) => {
          this.disableCopyPaste = oneSession[0].copy_paste;
      this.testService
        .getSessionQuestion(
          `?company_email=${
            this.companyEmailAddress}&application_id=${
            this.utilsService.getApplicationID('SERVICIMA')}&session_code=${
            this.sessionCode}`).subscribe((sessionQuestions) => {
        sessionQuestions.map((oneSessionQuestion) => {
          this.testService
            .getQuestion(`?test_question_code=${oneSessionQuestion.TestSessionQuestionsKey.test_question_code}`)
            .subscribe((question) => {
            this.questionsList.push(question[0]);
            this.testService.getChoices(`?test_question_code=${oneSessionQuestion.TestSessionQuestionsKey.test_question_code}`)
              .subscribe((choices) => {
                const correctChoice = [];
                choices.map( (oneChoice) => {
                  if (oneChoice.correct_choice === 'True') {
                    correctChoice.push(oneChoice.TestChoicesKey.test_choices_code);
                  }
                });
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
  }
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];
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
    if (this.checkedChoices.length === 0) {
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
      } else if (this.durationType === 'time_overall') {
        this.showExpiringPage = true;
    }
    }
  }
  finishTest() {
    const candidateResultCode = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-CANDIDATE-RESULT`;
    this.answeredQuestions.map( (oneQuestion) => {
      if (oneQuestion.correctChoice === oneQuestion.choiceCode)  {
        this.finalResult += oneQuestion.questionMark;
      }
    });
    const newTestResult = {
      company_email: this.companyEmailAddress,
      application_id:  this.utilsService.getApplicationID('SERVICIMA'),
      session_code: this.sessionCode,
      candidate_result_code: candidateResultCode,
      final_result: this.finalResult,
      time: this.durationType === 'time_overall' ? this.timePassed : this.timerPerQuestionTimePassed,
      answered_questions: this.answeredQuestions.length,
      total_questions: this.questionsList.length,
    };
    this.testService.addTestCandidateResults(newTestResult).subscribe( (testResult) => {
      this.answeredQuestions.map( (oneAnsweredQuestion, index) => {
        const answeredQuestion = {
          company_email: this.companyEmailAddress,
          application_id: newTestResult.application_id,
          session_code: this.sessionCode,
          candidate_result_code: candidateResultCode,
          candidate_response_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-CANDIDATE-RESPONSE`,
          response_code: oneAnsweredQuestion.choiceCode.toString(),
          question_code: oneAnsweredQuestion.questionCode,
          correct_answer: oneAnsweredQuestion.correctChoice.toString(),
        };
        this.testService.addTestCandidateResponse(answeredQuestion).subscribe( (response) => {
          console.log('response added', response);
          if (index + 1 === this.answeredQuestions.length) {
            this.showCongratulationPage = true;
          }
        });
      });
    });
  }
}
