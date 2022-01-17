import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { TestService } from '@core/services/test/test.service';
import { MatDialog } from '@angular/material/dialog';
import { ITestLevelModel } from '@shared/models/testLevel.model';
import { ModalService } from '@core/services/modal/modal.service';
import { Subscription } from 'rxjs';

import { QuestionDetailsComponent } from '../question-details/question-details.component';

@Component({
  selector: 'wid-bloc-questions-details',
  templateUrl: './bloc-questions-details.component.html',
  styleUrls: ['./bloc-questions-details.component.scss']
})
export class BlocQuestionsDetailsComponent implements OnInit {
  test_bloc_title = this.router.getCurrentNavigation().extras.state?.test_bloc_title;
  test_bloc_technology = this.router.getCurrentNavigation().extras.state?.test_bloc_technology;
  test_bloc_total_number = this.router.getCurrentNavigation().extras.state?.test_bloc_total_number;
  test_question_bloc_desc = this.router.getCurrentNavigation().extras.state?.test_question_bloc_desc;
  _id = this.router.getCurrentNavigation().extras.state?._id;
  test_question_bloc_code = this.router.getCurrentNavigation().extras.state?.test_question_bloc_code;
  questionsList: ITestQuestionModel[] = [];
  levelList: ITestLevelModel[] = [];
  showQuestionList = false;
  subscriptionModal: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private testService: TestService,
    private modalServices: ModalService,

  ) { }
  ngOnInit(): void {
    this.getLevelAll();
    this.getQuestionsInfo();
    console.log('question bloc code=', this.test_question_bloc_code);
  }
  getQuestionsInfo() {
    this.testService.getQuestion(`?test_question_bloc_code=${this.test_question_bloc_code}`).subscribe((value) => {
      if (value.length > 0) {
        this.questionsList = value;
        this.showQuestionList = true;
      }
      }
    );
  }
  getLevelAll() {
    this.testService.getLevel(`?application_id=5eac544a92809d7cd5dae21f`).subscribe((value) => {
      this.levelList = value;
    });
    }
    getLevel(code) {
    let level = '';
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
    this.router.navigate(['/manager/settings/bloc-question/add-question'],
      { state: {
          test_question_bloc_code: this.test_question_bloc_code,
        }
      });
  }

  // tslint:disable-next-line:max-line-length
  ShowQuestionDetail(test_question_title: string, test_level_code: string, test_question_code: string, mark: string, duration: string, question_type: string, test_question_desc: string, _id: string, test_question_bloc_code: string, code_level: string) {
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
      }
    }).afterClosed().subscribe((id) => {
      console.log('id=', id);
      if ((id !== undefined) && (id !== 'false')) {
        const confirmation = {
        code: 'delete',
        title: 'Delete This Question ?',
        description: 'Are you sure you want to delete this question?',
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .subscribe(
          (res) => {
            if (res === true) {
              console.log(id);
              this.testService.deleteQuestion(id).subscribe(dataBloc => {
                this.getLevelAll();
                this.getQuestionsInfo();
                if (this.questionsList.length === 1) {
                  this.questionsList.splice(0, 1);
                  this.showQuestionList = false;
                }
                console.log('Deleted');
              });
            }
            this.subscriptionModal.unsubscribe();
          }
        );
    } });
    console.log('question list', this.questionsList);
    console.log('after closed');
  }
}
