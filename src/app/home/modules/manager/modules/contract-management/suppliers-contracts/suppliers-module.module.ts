import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { AddSupplierComponent } from './suppliers/add-supplier/add-supplier.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { ContractListComponent } from './contracts/contract-list/contract-list.component';
import { SuppliersContractsComponent } from './suppliers-contracts.component';
import { AddContractComponent } from './contracts/add-contract/add-contract.component';
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
