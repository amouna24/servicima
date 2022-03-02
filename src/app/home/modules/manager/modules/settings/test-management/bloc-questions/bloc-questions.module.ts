import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { SharedModule } from '@shared/shared.module';

import { BlocQuestionsRoutingModule } from './bloc-questions-routing.module';
import { BlocQuestionsListComponent } from './bloc-questions-list/bloc-questions-list.component';
import { BlocQuestionsAddComponent } from './bloc-questions-add/bloc-questions-add.component';
import { BlocQuestionsDetailsComponent } from './bloc-questions-details/bloc-questions-details.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { AddAnswerComponent } from './add-answer/add-answer.component';

import { QuestionDetailsComponent } from './question-details/question-details.component';
import { EditBlocComponent } from './edit-bloc/edit-bloc.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';

@NgModule({
  declarations: [BlocQuestionsListComponent, BlocQuestionsAddComponent, BlocQuestionsDetailsComponent,
    AddQuestionComponent, AddAnswerComponent, QuestionDetailsComponent, EditBlocComponent, EditQuestionComponent],
  imports: [
    CommonModule,
    BlocQuestionsRoutingModule,
    DynamicDataTableModule,
    SharedModule
  ]
})
export class BlocQuestionsModule { }
