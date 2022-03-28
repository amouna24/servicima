import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  sendAddQuestion: FormGroup;
  LevelList =  [];
  question: ITestQuestionModel;
  applicationId: string;
  companyEmailAddress: string;
  test_question_bloc_code: string;
  test_question_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-QUESTION`;
  test_bloc_title: string;
  test_bloc_technology: string;
  test_bloc_total_number: string;
  test_question_bloc_desc: string;
  _id: string;
  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private utilsService: UtilsService,
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.getConnectedUser();
    this.getLevel();
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
    this.testService
      .getLevel(`?application_id=${
        this.applicationId}&company_email=ALL&language_id=${
        this.localStorageService.getItem('language').langId}`)
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
    const queryObject = {
        test_question_title: this.sendAddQuestion.controls.test_question_title.value,
        test_question_desc: this.sendAddQuestion.controls.test_question_desc.value,
        test_question_code: this.test_question_code,
        question_type: this.sendAddQuestion.controls.question_type.value,
        test_question_bloc_code: this.test_question_bloc_code,
        test_bloc_title: this.test_bloc_title,
        test_bloc_technology: this.test_bloc_technology,
        test_bloc_total_number: this.test_bloc_total_number,
        test_question_bloc_desc: this.test_question_bloc_desc,
        _id: this._id,
    };
    this.question = this.sendAddQuestion.value;
    this.question.test_question_code =  this.test_question_code;
    this.question.application_id = this.applicationId;
    this.question.company_email = 'ALL';
    this.question.order = '';
    this.question.test_question_bloc_code = this.test_question_bloc_code;
    this.question.to_display = '';
    if (this.sendAddQuestion.valid) {
      this.testService.addQuestion(this.question).subscribe(() => {
        this.utilsService.navigateWithQueryParam('/manager/settings/bloc-question/add-answer', queryObject);
      });
    }
  }
  loadData() {
   this.utilsService.verifyCurrentRoute('/manager/settings/bloc-question').subscribe( (data) => {
     this.test_question_bloc_code = data.test_question_bloc_code;
     this.test_bloc_title = data.test_bloc_title;
     this.test_bloc_technology = data.test_bloc_technology;
     this.test_bloc_total_number = data.test_bloc_total_number;
     this.test_question_bloc_desc = data.test_question_bloc_desc;
     this._id = data._id;
   });
  }

}
