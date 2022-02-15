import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';

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
    this.getLevel();
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
    this.testService.getLevel(`?application_id=${this.applicationId}&company_email=${this.companyEmailAddress}`)
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
    this.question.application_id = this.applicationId;
    this.question.company_email = this.companyEmailAddress;
    this.question.order = '';
    this.question.test_question_bloc_code = this.test_question_bloc_code;
    this.question._id = this.id;
    this.question.to_display = '';
    if (this.sendUpdateQuestion.valid) {
      this.testService.updateQuestion(this.question).subscribe(data => {
        console.log('question updated=', data);
        this.router.navigate(['/manager/settings/bloc-question/']);
      });
    }
  }
}
