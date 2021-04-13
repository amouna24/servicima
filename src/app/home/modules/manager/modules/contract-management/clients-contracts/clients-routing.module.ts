import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { AddClientComponent } from './clients/add-client/add-client.component';
import { ClientsContractsListComponent } from './contracts/clients-contracts-list/clients-contracts-list.component';
import { AddClientContractComponent } from './contracts/add-client-contract/add-client-contract.component';

const routes: Routes = [
  {
    path: 'contracts',
    component: AddClientContractComponent,
    data: {
      breadcrumb: 'new contract'
    },
  },
  {
    path: 'contracts-list',
    component: ClientsContractsListComponent,
    data: {
      breadcrumb: 'contracts'
    },
  },
  {
    path: 'clients',
    component: AddClientComponent,
    data: {
      breadcrumb: 'add client'
    },
  },
  {
    path: 'clients-list',
    component: ClientsListComponent,
    data: {
      breadcrumb: 'clients'
    },
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
