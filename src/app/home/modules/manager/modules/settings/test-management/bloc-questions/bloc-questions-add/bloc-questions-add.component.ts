import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-bloc-questions-add',
  templateUrl: './bloc-questions-add.component.html',
  styleUrls: ['./bloc-questions-add.component.scss']
})
export class BlocQuestionsAddComponent implements OnInit {
  sendAddTestBloc: FormGroup;
  TechList = [];
  testBlocQuestion: ITestQuestionBlocModel;
  applicationId: string;
  companyEmailAddress: string;
  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.createForm();
    this.getTechnologiesInfo();
    this.getConnectedUser();
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

  getTechnologiesInfo() {
    this.testService.getTechnologies(`?application_id=${this.applicationId}&company_email=${this.companyEmailAddress}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            response.forEach( (res) => {
              this.TechList.push(
                {
                  code: res.TestTechnologyKey.test_technology_code,
                  title: res.technology_title,
                });
            });
          }
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
    this.testBlocQuestion.application_id = this.applicationId;
    this.testBlocQuestion.company_email = this.companyEmailAddress;
    if (this.sendAddTestBloc.valid) {
      this.testService.addQuestionBloc(this.testBlocQuestion).subscribe(data => {
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
