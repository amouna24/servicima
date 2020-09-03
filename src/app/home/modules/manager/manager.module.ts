import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';

@NgModule({
  declarations: [ManagerComponent],
  imports: [
    ManagerRoutingModule,
    SharedModule,
    DataTableModule
  ]
})
export class ManagerModule { }
