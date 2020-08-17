import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddSupplierComponent } from './suppliers/add-supplier/add-supplier.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { AddSupplierContractComponent } from './contracts/add-supplier-contract/add-supplier-contract.component';
import { SuppliersContractsListComponent } from './contracts/suppliers-contracts-list/suppliers-contracts-list.component';

const routes: Routes = [
      {
        path: 'contracts',
        component: AddSupplierContractComponent, // a modifier
        data: {
          breadcrumb: 'new contract'
        },
      },
      {
        path: 'contracts-list',
        component: SuppliersContractsListComponent, // a modifier
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
