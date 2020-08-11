import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { AddClientComponent } from './clients/add-client/add-client.component';

const routes: Routes = [
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
