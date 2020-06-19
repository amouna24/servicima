import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddContractComponent } from './add-contract/add-contract.component';
import { ContractListComponent } from './contract-list/contract-list.component';

const routes: Routes = [
      {
        path: 'create',
        component: AddContractComponent
      },
      {
        path: 'list',
        component: ContractListComponent,
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
