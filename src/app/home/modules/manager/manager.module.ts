import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { ShareOnLinkedinComponent } from './modules/share-on-linkedin/share-on-linkedin.component';

@NgModule({
  declarations: [ManagerComponent, ShareOnLinkedinComponent],
  imports: [
    ManagerRoutingModule,
    SharedModule,
    DataTableModule
  ]
})
export class ManagerModule { }
