import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddContractComponent } from './contracts/add-contract/add-contract.component';
import { ContractListComponent } from './contracts/contract-list/contract-list.component';
import { AddSupplierComponent } from './suppliers/add-supplier/add-supplier.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';

const routes: Routes = [
      {
        path: 'create',
        component: AddContractComponent, // a modifier
        data: {
          breadcrumb: 'new contract'
        },
      },
      {
        path: 'contracts-list',
        component: ContractListComponent, // a modifier
        data: {
          breadcrumb: 'contracts'
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
