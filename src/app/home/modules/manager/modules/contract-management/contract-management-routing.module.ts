import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractManagementComponent } from './contract-management.component';

const routes: Routes = [
  {
    path: '',
    component: ContractManagementComponent,
    data: {
      breadcrumb: 'contract-management'
    },
    children: [
      {
        path: 'suppliers-contracts',
        loadChildren: () => import('./suppliers-contracts/suppliers-module.module').then(m => m.SuppliersModuleModule)
      },
      {
        path: 'clients-contracts',
        loadChildren: () => import('./clients-contracts/clients.module').then(m => m.ClientsModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }
