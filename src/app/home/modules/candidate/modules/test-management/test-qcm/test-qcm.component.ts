import { Component, OnInit } from '@angular/core';
import {
  questionCurrentToNext,
  questionCurrentToPrevious,
  questionDisplayNewNext,
  questionDisplayNewPrevious,
  questionNextToCurrent,
  questionPreviousToCurrent,
  timeChange,
} from '@shared/animations/animations';

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
    timeChange,
  ]
})
export class TestQcmComponent implements OnInit {
  listQuestions = [
    'Question number one here',
    'Question number two here',
    'Question number three here',
    'Question number four here',
    'Question number five here',
    'Question number six here',
    'Question number seven here',
    'Question number eight here',
    'Question number nine here',
  ];
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
  index = 1;
  animationStateNext = false;
  animationStatePrevious = false;
  maxTime = 7;
  timePassed = 0;
  timerInterval = null;
  timeLeft = this.maxTime;
  paddingTopMinutes = '';

  constructor() { }

  ngOnInit(): void {
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
             if ( this.timeLeft > 0) {
               if (this.timeLeft % 60 === 0) {
                 this.paddingTopMinutes = `animation: lastMinuteAnimation 1000ms infinite`;
                 this.paddingTopSeconds =  `animation: secondsAnimation 1000ms infinite`;
               } else if (this.timeLeft % 60 === 59 ) {
                 this.paddingTopMinutes = `animation: newMinuteAnimation 1000ms infinite`;
                 this.paddingTopSeconds =  `animation: secondsAnimation 1000ms infinite`;
               } else if (this.timeLeft === (this.maxTime - 1) ) {
                 this.paddingTopMinutes = ``;
                 this.paddingTopSeconds =  `animation: firstSecondAnimation 1000ms infinite`;
               } else {
                   this.paddingTopMinutes = ``;
                   this.paddingTopSeconds =  `animation: secondsAnimation 1000ms infinite`;
                 }
               } else {
               this.paddingTopMinutes = ``;
               this.paddingTopSeconds = 'animation: lastSecondAnimation 500ms; animation-iteration-count: 1;';
             }
           }, 1);
           this.timePassed++;
           this.timeLeft = this.maxTime - this.timePassed;
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
    const { alert, warning, info } = this.colorCodes;
    if (timeLeft <= this.maxTime / 4) {
      return alert.color;
    } else if (timeLeft <= this.maxTime / 2) {
     return warning.color;
    } else { return info.color; }
  }
  addIndex() {
    if ((this.listQuestions.length - 1) > this.index) {
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
    return  index < 0 || index >= (this.listQuestions.length) ?  '' : `Q${index + 1}: ${this.listQuestions[index]}`;
  }
}
