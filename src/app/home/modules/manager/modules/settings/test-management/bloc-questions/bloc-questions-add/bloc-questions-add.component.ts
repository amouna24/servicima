import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-bloc-questions-add',
  templateUrl: './bloc-questions-add.component.html',
  styleUrls: ['./bloc-questions-add.component.scss']
})
export class BlocQuestionsAddComponent implements OnInit {
  sendAddTestBloc: FormGroup;
  TechList = [];
  testBlocQuestion: ITestQuestionBlocModel;
  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getTechnologiesInfo();
  }
  getTechnologiesInfo() {
    this.testService.getTechnologies(`?application_id=5eac544a92809d7cd5dae21f`)
      .subscribe(
        (response) => {
          response.forEach(res => {
            console.log('res = ', res.TestTechnologyKey.test_technology_code);
            this.TechList.push(
              {
                code: res.TestTechnologyKey.test_technology_code,
                title: res.technology_title,
              });
          });
        },
        (error) => {
          if (error.error.msg_code === '0004') {
            console.log('empty table');
          }
        },
      );
  }
  createBlocQuestion() {
    this.testBlocQuestion = this.sendAddTestBloc.value;
    this.testBlocQuestion.test_question_bloc_code =  `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-QUESTION_BLOC`;
    this.testBlocQuestion.application_id = '5eac544a92809d7cd5dae21f';
    console.log('testBloc=', this.testBlocQuestion);
    if (this.sendAddTestBloc.valid) {
      this.testService.addQuestionBloc(this.testBlocQuestion).subscribe(data => {
        console.log('bloc created=', data);
        this.router.navigate(['/manager/settings/bloc-question/']);
      });
    }
  }
  createForm() {
    this.sendAddTestBloc = this.fb.group({
      test_question_bloc_title :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      test_technology_code: ['', [Validators.required]],
      question_nbr: ['', [Validators.required, Validators.pattern('^[1-9][0-9]?$|^100$')]],
      test_question_bloc_desc: '',
    });
  }
}
