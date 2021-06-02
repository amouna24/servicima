import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'skills',
    loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule),
    data: {
      breadcrumb: 'Skills'
    }},
  {
    path: 'bloc-question',
    loadChildren: () => import('./bloc-questions/bloc-questions.module').then(m => m.BlocQuestionsModule),
    data: {
      breadcrumb: 'role'
    } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
