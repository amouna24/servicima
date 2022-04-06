import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITestChoicesModel } from '@shared/models/testChoices.model';
import { TestService } from '@core/services/test/test.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-add-answer',
  templateUrl: './add-answer.component.html',
  styleUrls: ['./add-answer.component.scss']
})
export class AddAnswerComponent implements OnInit {
  test_question_title: string;
  test_question_desc: string;
  test_question_code: string;
  question_type: string;
  applicationId: string;
  sendAddAnswer: FormGroup;
  AnswerList: ITestChoicesModel[] = [];
  answer: ITestChoicesModel;
  public QuestionList = [];
  companyEmailAddress: string;
  test_bloc_title: string;
  test_bloc_technology: string;
  test_bloc_total_number: string;
  test_question_bloc_desc: string;
  _id: string;
   test_question_bloc_code: string;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private testService: TestService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.getConnectedUser();
    this.createQuestionList();
    this.createForm();
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  createForm() {
    this.sendAddAnswer = this.fb.group({
      choice_title: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      correct_choice: ['', [Validators.required]],
    });
  }

  createQuestionList() {
    this.QuestionList = ['True', 'False'];
  }

  createAnswer() {
    this.answer = this.sendAddAnswer.value;
    this.answer.test_question_code = this.test_question_code;
    this.answer.application_id = this.applicationId;
    this.answer.company_email = 'ALL';
    this.answer.language_id =  this.localStorageService.getItem('language').langId;
    this.answer.test_choices_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-ANSWER`;
    if ((this.sendAddAnswer.valid)) {
      if ((this.question_type === 'single') && (this.answer.correct_choice === 'True')) {
        this.QuestionList.splice(0, 1);
      }
      this.AnswerList.push(this.answer);

      this.sendAddAnswer.reset();
    }
  }

  saveAnswers() {
    this.AnswerList.forEach(res => {
      this.testService.addChoice(res).subscribe((resAnswer) => {
        console.log('answer added', resAnswer);
      });
    });
    const queryObject = {
      test_question_bloc_code: this.test_question_bloc_code,
      test_bloc_title: this.test_bloc_title,
      test_bloc_technology: this.test_bloc_technology,
      test_bloc_total_number: this.test_bloc_total_number,
      test_question_bloc_desc: this.test_question_bloc_desc,
      _id: this._id,
    };
    this.utilsService.navigateWithQueryParam('/manager/settings/bloc-question/details', queryObject);
  }

  loadData() {
    this.utilsService.verifyCurrentRoute('/manager/settings/bloc-question').subscribe( (data) => {
      this.test_question_title = data.test_question_title;
      this.test_question_desc = data.test_question_desc;
      this.test_question_code = data.test_question_code;
      this.question_type = data.question_type;
      this.test_question_bloc_code = data.test_question_bloc_code;
      this.test_bloc_title = data.test_bloc_title;
      this.test_bloc_technology = data.test_bloc_technology;
      this.test_bloc_total_number = data.test_bloc_total_number;
      this.test_question_bloc_desc = data.test_question_bloc_desc;
      this._id = data._id;
    });
  }
}
