import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HumanRessourcesComponent } from './human-ressources.component';
import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import { CertificationListComponent } from './certification-list/certification-list.component';

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
    path: 'work-certificate',
    component: CertificationListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumanRessourcesRoutingModule { }
