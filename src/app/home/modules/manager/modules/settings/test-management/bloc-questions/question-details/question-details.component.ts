import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITestChoicesModel } from '@shared/models/testChoices.model';
import { TestService } from '@core/services/test/test.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {
  testQuestionTitle: string;
  testLevelCode: string;
  testQuestionCode: string;
  mark: string;
  duration: string;
  questionType: string;
  testQuestionDesc: string;
  technology: string;
  id: string;
  testQuestionBlocCode: string;
  AnswerDetails: ITestChoicesModel[] = [];
  subscriptionModal: Subscription;
  closeDialog: boolean;
  codeLevel: string;
  companyEmailAddress: string;
  displayedLevel: string;
  language_tech: string;
  code: string;

  constructor(
    private dialogRef: MatDialogRef<QuestionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private testService: TestService,
    private modalServices: ModalService,
    private router: Router,
    private userService: UserService,
    private utilsService: UtilsService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getConnectedUser();
    this.initQuestionValues();
    this.getAnswers();
    this.getLevel();

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

initQuestionValues() {
  this.testQuestionTitle = this.data.test_question_title;
  this.testLevelCode = this.data.test_level_code;
  this.testQuestionCode = this.data.test_question_code;
  this.mark = this.data.mark;
  this.duration = this.data.duration;
  this.code = this.data.code;
  this.language_tech = this.data.language_tech;
  this.questionType = this.data.question_type;
  this.testQuestionDesc = this.data.test_question_desc;
  this.technology = this.data.technology;
  this.id = this.data.id;
  this.testQuestionBlocCode = this.data.test_question_bloc_code;
  this.codeLevel = this.data.code_level;
}
getLevel() {
    this.testService
      .getLevel(`?test_level_code=${this.codeLevel}&language_id=${this.localStorageService.getItem('language').langId}`)
      .subscribe( (level) => {
        this.displayedLevel = level[0].test_level_title;
      });
}
getAnswers() {
    this.testService.getChoices(`?test_question_code=${this.data.test_question_code}&company_email=ALL`)
      .subscribe((value) => {
        this.AnswerDetails = value;
      });
}
deleteQuestions() {
  const confirmation = {
    code: 'delete',
    title: 'Delete This Question ?',
  };
  this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
    .subscribe(
      (res) => {
        if (res === true) {
          this.testService.deleteQuestion(this.id).subscribe(dataBloc => {
            console.log('Deleted');
            this.router.navigate(['/manager/settings/bloc-question/details']);
            this.closeDialog = true;
          });
        }
        this.subscriptionModal.unsubscribe();
      }
    );
}
  routeToQuestion() {
    const queryObject = {
      test_question_title:  this.testQuestionTitle,
      mark: this.mark,
      duration: this.duration,
      code: this.code,
      language_tech: this.language_tech,
      question_type: this.questionType,
      test_level_code: this.codeLevel,
      test_question_desc: this.testQuestionDesc,
      test_question_code: this.testQuestionCode,
      test_question_bloc_code: this.testQuestionBlocCode,
      _id: this.id
    };
    this.utilsService.navigateWithQueryParam('/manager/settings/bloc-question/edit-question', queryObject);
  }
}
