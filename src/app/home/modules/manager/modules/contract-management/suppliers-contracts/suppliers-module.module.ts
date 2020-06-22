import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { SuppliersContractsComponent } from './suppliers-contracts.component';
import { AddContractComponent } from './add-contract/add-contract.component';
import { ContractManagementModule } from '../contract-management.module';

@NgModule({
  declarations: [
    AddSupplierComponent,
    AddContractComponent,
    SupplierListComponent,
    SuppliersContractsComponent,
    ContractListComponent,
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    ContractManagementModule,
    SharedModule,
  ]
})
export class SuppliersModuleModule { }
