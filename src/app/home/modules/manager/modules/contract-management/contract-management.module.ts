import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractManagementComponent } from './contract-management.component';

@NgModule({
  declarations: [ContractManagementComponent],
  imports: [
    CommonModule,
    ContractManagementRoutingModule
  ]
})
export class ContractManagementModule { }