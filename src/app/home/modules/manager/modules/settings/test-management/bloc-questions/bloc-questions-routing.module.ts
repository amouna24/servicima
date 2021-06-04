import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocQuestionsAddComponent } from './bloc-questions-add/bloc-questions-add.component';
import { BlocQuestionsListComponent } from './bloc-questions-list/bloc-questions-list.component';
import { BlocQuestionsDetailsComponent } from './bloc-questions-details/bloc-questions-details.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { AddAnswerComponent } from './add-answer/add-answer.component';
import { EditBlocComponent } from './edit-bloc/edit-bloc.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';

const routes: Routes = [
  { path: '', component: BlocQuestionsListComponent},
  { path: 'details', component: BlocQuestionsDetailsComponent},
  { path: 'add', component: BlocQuestionsAddComponent},
  { path: 'add-question', component: AddQuestionComponent},
  { path: 'add-answer', component: AddAnswerComponent},
  { path: 'edit', component: EditBlocComponent},
  { path: 'edit-question', component: EditQuestionComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlocQuestionsRoutingModule { }
