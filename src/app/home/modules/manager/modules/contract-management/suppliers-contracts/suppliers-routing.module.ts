import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddSupplierComponent } from './suppliers/add-supplier/add-supplier.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { AddSupplierContractComponent } from './contracts/add-supplier-contract/add-supplier-contract.component';
import { SuppliersContractsListComponent } from './contracts/suppliers-contracts-list/suppliers-contracts-list.component';
import { ProjectsListComponent } from '../common-actions/projects/projects-list/projects-list.component';
import { AddProjectComponent } from '../common-actions/projects/add-project/add-project.component';
import { AffectCollaboratorComponent } from '../common-actions/collaborators/affect-collaborator/affect-collaborator.component';
import { CollaboratorsListComponent } from '../common-actions/collaborators/collaborators-list/collaborators-list.component';

const routes: Routes = [
      {
        path: 'contracts',
        component: AddSupplierContractComponent,
        data: {
          breadcrumb: 'new contract'
        },
      },
      {
        path: 'contracts-list',
        component: SuppliersContractsListComponent,
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
        path: 'suppliers',
        component: AddSupplierComponent,
        data: {
          breadcrumb: 'add supplier'
        },
      },
      {
        path: 'suppliers-list',
        component: SupplierListComponent,
        data: {
          breadcrumb: 'suppliers'
        },
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
