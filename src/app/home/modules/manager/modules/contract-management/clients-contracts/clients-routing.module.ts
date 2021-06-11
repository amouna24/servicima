import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { AddClientComponent } from './clients/add-client/add-client.component';
import { ClientsContractsListComponent } from './contracts/clients-contracts-list/clients-contracts-list.component';
import { AddClientContractComponent } from './contracts/add-client-contract/add-client-contract.component';
import { AddProjectComponent } from '../common-actions/projects/add-project/add-project.component';
import { ProjectsListComponent } from '../common-actions/projects/projects-list/projects-list.component';
import { AffectCollaboratorComponent } from '../common-actions/collaborators/affect-collaborator/affect-collaborator.component';
import { CollaboratorsListComponent } from '../common-actions/collaborators/collaborators-list/collaborators-list.component';

const routes: Routes = [
      {
        path: 'contracts',
        component: AddClientContractComponent,
        data: {
          breadcrumb: 'new contract'
        },
      },
      {
        path: 'contracts-list',
        component: ClientsContractsListComponent,
        data: {
          breadcrumb: 'contracts'
        },
      },
      {
        path: 'projects',
        component: AddProjectComponent,
        data: {
          breadcrumb: 'new project'
        },
      },
      {
        path: 'projects-list',
        component: ProjectsListComponent,
        data: {
          breadcrumb: 'projects'
        },
      },
      {
        path: 'collaborators',
        component: AffectCollaboratorComponent,
        data: {
          breadcrumb: 'collaborators'
        },
      },
      {
        path: 'collaborators-list',
        component: CollaboratorsListComponent,
        data: {
          breadcrumb: 'collaborators'
        },
      },
      {
        path: 'clients',
        component: AddClientComponent,
        data: {
          breadcrumb: 'add client'
        },
      },
      {
        path: 'clients-list',
        component: ClientsListComponent,
        data: {
          breadcrumb: 'clients'
        },
      }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
