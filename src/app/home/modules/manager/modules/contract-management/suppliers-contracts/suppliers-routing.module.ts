import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddContractComponent } from './add-contract/add-contract.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';

const routes: Routes = [
      {
        path: 'create',
        component: AddContractComponent // a modifier
      },
      {
        path: 'contracts-list',
        component: ContractListComponent, // a modifier
      },
      {
        path: 'suppliers',
        component: AddSupplierComponent
      },
      {
        path: 'suppliers-list',
        component: SupplierListComponent,
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
