import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
  sendUpdateQuestion: FormGroup;
  LevelList = [];
  question: ITestQuestionModel;
  test_question_title = this.router.getCurrentNavigation().extras.state?.test_question_title;
  mark = this.router.getCurrentNavigation().extras.state?.mark;
  duration = this.router.getCurrentNavigation().extras.state?.duration;
  question_type = this.router.getCurrentNavigation().extras.state?.question_type;
  test_level_code = this.router.getCurrentNavigation().extras.state?.test_level_code;
  test_question_desc = this.router.getCurrentNavigation().extras.state?.test_question_desc;
  test_question_code = this.router.getCurrentNavigation().extras.state?.test_question_code;
  test_question_bloc_code = this.router.getCurrentNavigation().extras.state?.test_question_bloc_code;
  id = this.router.getCurrentNavigation().extras.state?._id;
  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getLevel();
    this.createForm();
  }
  createForm() {
    this.sendUpdateQuestion = this.fb.group({
      test_question_title :  [ this.test_question_title, [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      mark: [ this.mark, [Validators.required, Validators.pattern('^[1-9][0-9]?$|^100$')]],
      duration: [ this.duration, [Validators.required]],
      question_type: [ this.question_type, [Validators.required]],
      test_level_code: [this.test_level_code, [Validators.required]],
      test_question_desc: this.test_question_desc,
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
  UpdateQuestion() {
    this.question = this.sendUpdateQuestion.value;
    this.question.test_question_code =  this.test_question_code;
    this.question.application_id = '5eac544a92809d7cd5dae21f';
    this.question.order = '';
    this.question.test_question_bloc_code = this.test_question_bloc_code;
    this.question._id = this.id;
    this.question.to_display = '';
    if (this.sendUpdateQuestion.valid) {
      console.log('question form', this.question);
      this.testService.updateQuestion(this.question).subscribe(data => {
        console.log('question updated=', data);
        this.router.navigate(['/manager/settings/bloc-question/']);
/*          { state: {
              test_question_title: this.sendAddQuestion.controls.test_question_title.value,
              test_question_desc: this.sendAddQuestion.controls.test_question_desc.value,
              test_question_code: this.test_question_code,
              question_type: this.sendAddQuestion.controls.question_type.value,
            }
          });*/
      });
    }
  }
}
