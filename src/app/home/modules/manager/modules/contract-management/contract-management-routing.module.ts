import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractManagementComponent } from './contract-management.component';


const routes: Routes = [
  {
    path: '',
    component: ContractManagementComponent
    ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }
