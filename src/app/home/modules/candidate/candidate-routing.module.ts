import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
        path: 'cv',
        loadChildren: () => import('../../../shared/modules/cv/cv.module').then(m => m.CvModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
