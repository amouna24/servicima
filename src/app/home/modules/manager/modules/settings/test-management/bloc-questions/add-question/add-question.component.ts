import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  sendAddQuestion: FormGroup;
  LevelList = [];
  MarkList = [];
  TypeQuestionList = [];
  question: ITestQuestionModel;
  test_question_bloc_code = this.router.getCurrentNavigation().extras.state?.test_question_bloc_code;
  test_question_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-QUESTION`;
  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log('test quesyion bloc code', this.test_question_bloc_code);
    this.getLevel();
    this.createForm();
  }
  createForm() {
    this.sendAddQuestion = this.fb.group({
      test_question_title :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      mark: ['', [Validators.required, Validators.pattern('^[1-9][0-9]?$|^100$')]],
      duration: ['', [Validators.required]],
      question_type: ['', [Validators.required]],
      test_level_code: ['', [Validators.required]],
      test_question_desc: '',
    });
  }
  getLevel() {
    this.testService.getLevel(`?application_id=5eac544a92809d7cd5dae21f`)
      .subscribe(
        (response) => {
           this.LevelList = response;
        },
        (error) => {
          if (error.error.msg_code === '0004') {
            console.log('empty table');
          }
        },
      );
  }
  createQuestion() {
    this.question = this.sendAddQuestion.value;
    this.question.test_question_code =  this.test_question_code;
    this.question.application_id = '5eac544a92809d7cd5dae21f';
    this.question.order = '';
    this.question.test_question_bloc_code = this.test_question_bloc_code;
    this.question.to_display = '';
    if (this.sendAddQuestion.valid) {
      console.log('question form', this.question);
      this.testService.addQuestion(this.question).subscribe(data => {
        console.log('question created=', data);
        this.router.navigate(['/manager/settings/bloc-question/add-answer'],
          { state: {
              test_question_title: this.sendAddQuestion.controls.test_question_title.value,
              test_question_desc: this.sendAddQuestion.controls.test_question_desc.value,
              test_question_code: this.test_question_code,
              question_type: this.sendAddQuestion.controls.question_type.value,
            }
          });
      });
    }
  }

}
