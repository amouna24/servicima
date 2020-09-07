import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { AddSupplierComponent } from './suppliers/add-supplier/add-supplier.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { SuppliersContractsComponent } from './suppliers-contracts.component';
import { ContractManagementModule } from '../contract-management.module';
import { AddSupplierContractComponent } from './contracts/add-supplier-contract/add-supplier-contract.component';
import { SuppliersContractsListComponent } from './contracts/suppliers-contracts-list/suppliers-contracts-list.component';

@NgModule({
  declarations: [
    AddSupplierComponent,
    SupplierListComponent,
    SuppliersContractsComponent,
    AddSupplierContractComponent,
    SuppliersContractsListComponent,
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    ContractManagementModule,
    SharedModule,
  ]
})
export class SuppliersModuleModule { }
