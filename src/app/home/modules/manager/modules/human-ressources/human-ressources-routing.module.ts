import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HumanRessourcesComponent } from './human-ressources.component';
import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import { CertificationListComponent } from './certification-list/certification-list.component';
import { CollaboratorComponent } from './collaborator/collaborator.component';
import { ShowCertificationComponent } from './certifications/show-certification/show-certification.component';
import { CandidatesListComponent } from './candidates/candidates-list/candidates-list.component';
import { CandidateFileComponent } from './candidates/candidate-file/candidate-file.component';

const routes: Routes = [
  {
    path: '',
    component: HumanRessourcesComponent,
    data: {
      breadcrumb: 'human-resources'
    },
  },
  {
    path: 'collaborator-list',
    component: CollaboratorListComponent
  },
  {
    path: 'candidates-list',
    component: CandidatesListComponent
  },
  {
    path: 'candidate-file',
    component: CandidateFileComponent
  },
  {
    path: 'work-certificate',
    component: CertificationListComponent
  },
  {
    path: 'show-certif',
    component: ShowCertificationComponent
  },
  {
    path: 'collaborator',
    component: CollaboratorComponent
  },
  {
    path: 'payslip',
    loadChildren: () => import('./payslip/payslip.module').then(m => m.PayslipModule),
  },
  {
    path: 'training',
    loadChildren: () => import('./training/training.module').then(m => m.TrainingModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumanRessourcesRoutingModule { }
