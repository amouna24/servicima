import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { ShareOnLinkedinComponent } from './modules/share-on-linkedin/share-on-linkedin.component';
import { ShareOnLinkedinModalComponent } from './modules/share-on-linkedin/share-on-linkedin-modal/share-on-linkedin-modal.component';

@NgModule({
  declarations: [ManagerComponent, ShareOnLinkedinComponent, ShareOnLinkedinModalComponent],
  imports: [
    ManagerRoutingModule,
    SharedModule,
    DataTableModule
  ]
})
export class ManagerModule { }
