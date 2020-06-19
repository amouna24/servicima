import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractManagementComponent } from './contract-management.component';
import { ContractListComponent } from './suppliers-contracts/contract-list/contract-list.component';
import { AddContractComponent } from './suppliers-contracts/add-contract/add-contract.component';
import { SuppliersContractsComponent } from './suppliers-contracts/suppliers-contracts.component';
import { ClientsContractsComponent } from './clients-contracts/clients-contracts.component';

@NgModule({
  declarations: [
    ContractManagementComponent,
    ContractListComponent,
    AddContractComponent,
    SuppliersContractsComponent,
    ClientsContractsComponent,
  ],
    imports: [
        CommonModule,
        ContractManagementRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
    ]
})
export class ContractManagementModule { }
