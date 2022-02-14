import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITestChoicesModel } from '@shared/models/testChoices.model';
import { TestService } from '@core/services/test/test.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {
  test_question_title = '';
  test_level_code = '';
  test_question_code = '';
  mark = '';
  duration = '';
  question_type = '';
  test_question_desc = '';
  technology = '';
  id: string;
  test_question_bloc_code = '';
  AnswerDetails: ITestChoicesModel[] = [];
  subscriptionModal: Subscription;
  closeDialog: boolean;
  code_level = '';

  constructor(
    private dialogRef: MatDialogRef<QuestionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private testService: TestService,
    private modalServices: ModalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initQuestionValues();
    this.getAnswers();
  }
initQuestionValues() {
  this.test_question_title = this.data.test_question_title;
  this.test_level_code = this.data.test_level_code;
  this.test_question_code = this.data.test_question_code;
  this.mark = this.data.mark;
  this.duration = this.data.duration;
  this.question_type = this.data.question_type;
  this.test_question_desc = this.data.test_question_desc;
  this.technology = this.data.technology;
  this.id = this.data.id;
  this.test_question_bloc_code = this.data.test_question_bloc_code;
  this.code_level = this.data.code_level;
}
getAnswers() {
    this.testService.getChoices(`?test_question_code=${this.data.test_question_code}`)
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
    this.router.navigate(['/manager/settings/bloc-question/edit-question'],
      { state: {
          test_question_title:  this.test_question_title,
          mark: this.mark,
          duration: this.duration,
          question_type: this.question_type,
          test_level_code: this.code_level,
          test_question_desc: this.test_question_desc,
          test_question_code: this.test_question_code,
          test_question_bloc_code: this.test_question_bloc_code,
          _id: this.id
        }
      });
  }
}
