import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractManagementComponent } from './contract-management.component';
import { AddContractorComponent } from './common-actions/contractors/add-contractor/add-contractor.component';
import { ContractorsListComponent } from './common-actions/contractors/contractors-list/contractors-list.component';
import { ShowModalComponent } from './common-actions/contractors/show-modal/show-modal.component';

@NgModule({
  declarations: [
    ContractManagementComponent,
    AddContractorComponent,
    ContractorsListComponent,
    ShowModalComponent,
  ],
    imports: [
        CommonModule,
        ContractManagementRoutingModule,
        SharedModule,
    ],
  exports: [
    ContractorsListComponent,
    AddContractorComponent,
  ]
})
export class ContractManagementModule { }
