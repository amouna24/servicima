import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';

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
    this.getTechnologiesInfo();
    this.createForm();
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
    this.testBlocQuestion.application_id = this.applicationId;
    this.testBlocQuestion.company_email = this.companyEmailAddress;
    this.testBlocQuestion._id = this._id;
    if (this.sendUpdateBloc.valid) {
      this.testService.updateQuestionBloc(this.testBlocQuestion).subscribe(data => {
        this.router.navigate(['/manager/settings/bloc-question/']);
      });
    }
  }
}
