import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CandidateComponent } from './candidate.component';

const routes: Routes = [
  {
    path: '',
    component: CandidateComponent,
    children: [
      {
        path: 'evaluations',
        loadChildren: () => import('./modules/evaluations/evaluations.module').then(m => m.EvaluationsModule)
      },
      {
        path: 'files',
        loadChildren: () => import('./modules/files/files.module').then(m => m.FilesModule)
      },
      {
        path: 'visa-files',
        loadChildren: () => import('./modules/visa-files/visa-files.module').then(m => m.VisaFilesModule)
      },
      {
        path: 'resume',
        loadChildren: () => import('@shared/modules/resume-management/resume-management.module').then(m => m.ResumeManagementModule)
      },
      {
        path: 'user',
        data: {
          breadcrumb: 'user'
        },
        loadChildren: () => import('@shared/components/settings/user.module').then(m => m.UserModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
