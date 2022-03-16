import { Component, OnInit } from '@angular/core';
import {
  questionCurrentToNext,
  questionCurrentToPrevious,
  questionDisplayNewNext,
  questionDisplayNewPrevious,
  questionNextToCurrent,
  questionPreviousToCurrent
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
    questionDisplayNewPrevious
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
  index = 1;
  animationStateNext = false;
  animationStatePrevious = false;
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
    test() {
      console.log(this.animationStateNext, this.index, (this.listQuestions.length - 1));
    }
  constructor() { }

  ngOnInit(): void {
  }

}
