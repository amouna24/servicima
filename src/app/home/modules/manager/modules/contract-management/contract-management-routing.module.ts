import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractManagementComponent } from './contract-management.component';

const routes: Routes = [
  {
    path: '',
    component: ContractManagementComponent,
    children: [
      {
        path: 'suppliers-contracts',
        loadChildren: () => import('./suppliers-contracts/suppliers-module.module').then(m => m.SuppliersModuleModule),
        data: {
          breadcrumb: 'suppliers-contracts'
        },
      },
      {
        path: 'clients-contracts',
        loadChildren: () => import('./clients-contracts/clients.module').then(m => m.ClientsModule),
        data: {
          breadcrumb: 'clients-contracts'
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }
