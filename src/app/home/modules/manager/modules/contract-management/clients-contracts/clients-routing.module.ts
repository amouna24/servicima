import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientsListComponent } from './clients-list/clients-list.component';
import { AddClientComponent } from './add-client/add-client.component';

const routes: Routes = [
  {
    path: 'clients',
    component: AddClientComponent
  },
  {
    path: 'clients-list',
    component: ClientsListComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
