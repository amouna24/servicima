import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITestChoicesModel } from '@shared/models/testChoices.model';
import { TestService } from '@core/services/test/test.service';

@Component({
  selector: 'wid-add-answer',
  templateUrl: './add-answer.component.html',
  styleUrls: ['./add-answer.component.scss']
})
export class AddAnswerComponent implements OnInit {
  test_question_title = this.router.getCurrentNavigation().extras.state?.test_question_title;
  test_question_desc = this.router.getCurrentNavigation().extras.state?.test_question_desc;
  test_question_code = this.router.getCurrentNavigation().extras.state?.test_question_code;
  question_type = this.router.getCurrentNavigation().extras.state?.question_type;

  sendAddAnswer: FormGroup;
  AnswerList: ITestChoicesModel[] = [];
  answer: ITestChoicesModel;
  private singleChoice = false;
  public QuestionList = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private testService: TestService,
  ) { }

  ngOnInit(): void {
    this.createQuestionList();
    this.createForm();
  }
  createForm() {
    this.sendAddAnswer = this.fb.group({
      choice_title :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      correct_choice: '',
    });
  }
  createQuestionList() {
    this.QuestionList = ['True', 'False'];
  }
  createAnswer() {
    console.log(this.question_type);
    this.answer = this.sendAddAnswer.value;
    this.answer.test_question_code =  this.test_question_code;
    this.answer.application_id = '5eac544a92809d7cd5dae21f';
    this.answer.test_choices_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-ANSWER`;
     if ((this.sendAddAnswer.valid) ) {
       if (( this.question_type === 'single') && (this.answer.correct_choice === 'True')) {
         this.QuestionList.splice(0, 1);
         console.log('question list=', this.QuestionList);
     }
       this.AnswerList.push(this.answer);

       this.sendAddAnswer.reset(); }
  }
  saveAnswers() {
    this.AnswerList.forEach(res => {
     this.testService.addChoice(res).subscribe((resAnswer) => {
       console.log('answer added', resAnswer);
     });
    });
    this.router.navigate(['/manager/settings/bloc-question/']);
  }
}
