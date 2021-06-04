import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractManagementComponent } from './contract-management.component';
import { AddContractorComponent } from './common-actions/contractors/add-contractor/add-contractor.component';
import { ContractorsListComponent } from './common-actions/contractors/contractors-list/contractors-list.component';
import { ShowModalComponent } from './common-actions/contractors/show-modal/show-modal.component';
import { ContractsListComponent } from './common-actions/contracts/contracts-list/contracts-list.component';
import { AddContractComponent } from './common-actions/contracts/add-contract/add-contract.component';
import { ShowExtensionComponent } from './common-actions/contracts/show-extension/show-extension.component';
import { AddProjectComponent } from './common-actions/projects/add-project/add-project.component';
import { ProjectsListComponent } from './common-actions/projects/projects-list/projects-list.component';
import { CollaboratorsListComponent } from './common-actions/collaborators/collaborators-list/collaborators-list.component';
import { AffectCollaboratorComponent } from './common-actions/collaborators/affect-collaborator/affect-collaborator.component';

@NgModule({
  declarations: [
    ContractManagementComponent,
    AddContractorComponent,
    ContractorsListComponent,
    ShowModalComponent,
    ContractsListComponent,
    AddContractComponent,
    ShowExtensionComponent,
    AddProjectComponent,
    ProjectsListComponent,
    CollaboratorsListComponent,
    AffectCollaboratorComponent,
  ],
    imports: [
        CommonModule,
        ContractManagementRoutingModule,
        SharedModule,
        DynamicDataTableModule,
    ],
    exports: [
      ContractorsListComponent,
      AddContractorComponent,
      ContractsListComponent,
      AddContractComponent,
    ]
})
export class ContractManagementModule { }
