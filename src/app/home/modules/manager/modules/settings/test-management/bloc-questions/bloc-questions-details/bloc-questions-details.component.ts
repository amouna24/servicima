import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { TestService } from '@core/services/test/test.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { ITestLevelModel } from '@shared/models/testLevel.model';
import { ModalService } from '@core/services/modal/modal.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';

import { QuestionDetailsComponent } from '../question-details/question-details.component';

@Component({
  selector: 'wid-bloc-questions-details',
  templateUrl: './bloc-questions-details.component.html',
  styleUrls: ['./bloc-questions-details.component.scss']
})
export class BlocQuestionsDetailsComponent implements OnInit {
  test_bloc_title: string;
  test_bloc_technology: string;
  test_bloc_total_number: string;
  test_question_bloc_desc: string;
  _id: string;
  test_question_bloc_code: string;
  questionsList: ITestQuestionModel[] = [];
  levelList: ITestLevelModel[] = [];
  showQuestionList = false;
  subscriptionModal: Subscription;
  applicationId: string;
  companyEmailAddress: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private testService: TestService,
    private modalServices: ModalService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
  ) {
    this.loadData();
  }
  ngOnInit(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.getConnectedUser();
    this.getLevelAll();
    this.getQuestionsInfo();
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

  getQuestionsInfo() {
    // tslint:disable-next-line:max-line-length
    this.testService.getQuestion(`?test_question_bloc_code=${this.test_question_bloc_code}&application_id=${this.applicationId}&company_email=ALL`).subscribe((value) => {
      if (value.length > 0) {
        this.questionsList = value;
        this.showQuestionList = true;
      }
      }
    );
  }
  getLevelAll() {
    this.testService.getLevel(`?application_id=${this.applicationId}&company_email=ALL`).subscribe((value) => {
      this.levelList = value;
    });
    }

    getLevel(code) {
    let level: string;
    let i = 0;
    while ((this.levelList.length > i) && (level !== this.levelList[i].test_level_title)) {
      if (this.levelList[i].TestLevelKey.test_level_code === code) {
        level = this.levelList[i].test_level_title;
      } else {
        i++;
      }
    }
    return(level);
    }

  routeToAdd() {
    const queryObject = {
      test_question_bloc_code: this.test_question_bloc_code,
      test_bloc_title: this.test_bloc_title,
      test_bloc_technology: this.test_bloc_technology,
      test_bloc_total_number: this.test_bloc_total_number,
      test_question_bloc_desc: this.test_question_bloc_desc,
      _id: this._id,
    };
    this.utilsService.navigateWithQueryParam('/manager/settings/bloc-question/add-question', queryObject);
  }

  ShowQuestionDetail(test_question_title: string, test_level_code: string, test_question_code: string,
                     mark: string, duration: string, question_type: string, test_question_desc: string,
                     _id: string, test_question_bloc_code: string, code_level: string, code: string, language_tech: string) {
    this.dialog.open(QuestionDetailsComponent, {
      height: '90vh',
      width: '85vh',
      data: {
        test_question_title,
        test_level_code,
        test_question_code,
        mark,
        duration,
        question_type,
        test_question_desc,
        test_question_bloc_code,
        technology: this.test_bloc_technology,
        id: _id,
        code_level,
        code,
        language_tech
      }
    }).afterClosed().subscribe((id) => {
      if ((id !== undefined) && (id !== 'false') && (id !== 'closeDialog')) {
        const confirmation = {
        code: 'delete',
        title: 'Delete This Question ?',
        description: 'Are you sure you want to delete this question?',
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .subscribe(
          (res) => {
            if (res === true) {
              this.testService.deleteQuestion(id).subscribe(dataBloc => {
                this.getLevelAll();
                this.getQuestionsInfo();
                if (this.questionsList.length === 1) {
                  this.questionsList.splice(0, 1);
                  this.showQuestionList = false;
                }
              });
            }
            this.subscriptionModal.unsubscribe();
          }
        );
    } });
  }
  loadData() {
    this.utilsService.verifyCurrentRoute('/manager/settings/bloc-question').subscribe( (data) => {
      this.test_bloc_title = data.test_bloc_title;
      this.test_bloc_technology = data.test_bloc_technology;
      this.test_bloc_total_number = data.test_bloc_total_number;
      this.test_question_bloc_desc = data.test_question_bloc_desc;
      this._id = data._id;
      this.test_question_bloc_code = data.test_question_bloc_code;
    });
  }
}
