import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';

@Component({
  selector: 'wid-edit-bloc',
  templateUrl: './edit-bloc.component.html',
  styleUrls: ['./edit-bloc.component.scss']
})
export class EditBlocComponent implements OnInit {
  sendUpdateBloc: FormGroup;
  TechList = [];
  testBlocQuestion: ITestQuestionBlocModel;
  test_question_bloc_title = this.router.getCurrentNavigation().extras.state?.test_bloc_title;
  test_technology_code = this.router.getCurrentNavigation().extras.state?.test_bloc_technology;
  question_nbr = this.router.getCurrentNavigation().extras.state?.test_bloc_total_number;
  test_question_bloc_desc = this.router.getCurrentNavigation().extras.state?.test_question_bloc_desc;
  test_question_bloc_code = this.router.getCurrentNavigation().extras.state?.test_question_bloc_code;
  _id = this.router.getCurrentNavigation().extras.state?._id;

  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.getTechnologiesInfo();
    this.createForm();
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
  createForm() {
    this.sendUpdateBloc = this.fb.group({
      test_question_bloc_title :  [this.test_question_bloc_title, [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      test_technology_code: [this.test_technology_code, [Validators.required]],
      question_nbr: [this.question_nbr, [Validators.required, Validators.pattern('^[1-9][0-9]?$|^100$')]],
      test_question_bloc_desc: this.test_question_bloc_desc,
    });
  }
  UpdateBlocQuestion() {
    this.testBlocQuestion = this.sendUpdateBloc.value;
    this.testBlocQuestion.test_question_bloc_code =  this.test_question_bloc_code;
    this.testBlocQuestion.application_id = '5eac544a92809d7cd5dae21f';
    this.testBlocQuestion._id = this._id;
    console.log('testBloc=', this.testBlocQuestion);
    if (this.sendUpdateBloc.valid) {
      this.testService.updateQuestionBloc(this.testBlocQuestion).subscribe(data => {
        console.log('bloc updated=', data);
        this.router.navigate(['/manager/settings/bloc-question/']);
      });
    }
  }
}
