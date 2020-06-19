import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractManagementComponent } from './contract-management.component';
import { ContractListComponent } from './suppliers-contracts/contract-list/contract-list.component';
import { AddContractComponent } from './suppliers-contracts/add-contract/add-contract.component';
import { SuppliersContractsComponent } from './suppliers-contracts/suppliers-contracts.component';
import { ClientsContractsComponent } from './clients-contracts/clients-contracts.component';

const routes: Routes = [
  {
    path: '',
    component: ContractManagementComponent,
    children: [
      {
        path: 'suppliers-contracts',
        loadChildren: () => import('./suppliers-contracts/suppliers-module.module').then(m => m.SuppliersModuleModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }
