import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { ProExpComponent } from '@shared/modules/resume-management/modules/resume-professional-experiences/modules/professional-experiences/pro-exp.component';
// tslint:disable-next-line:max-line-length
import { ProExpProjectsComponent } from '@shared/modules/resume-management/modules/resume-professional-experiences/modules/professional-experiences-projects/pro-exp-projects.component';

const routes: Routes = [
  { path: 'professionalExperience', component: ProExpComponent},
  { path: 'projects', component: ProExpProjectsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeProExpRoutingModule { }
