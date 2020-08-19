import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { ContractManagementModule } from '../contract-management.module';
import { AddClientComponent } from './clients/add-client/add-client.component';
import { ClientsContractsComponent } from './clients-contracts.component';

@NgModule({
  declarations: [
    AddClientComponent,
    ClientsListComponent,
    ClientsContractsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule,
    ContractManagementModule,
  ]
})
export class ClientsModule { }
