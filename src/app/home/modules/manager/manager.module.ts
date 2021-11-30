import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';
import { CommonModule } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { ShareOnLinkedinComponent } from './modules/share-on-linkedin/share-on-linkedin.component';
import { ShareOnLinkedinModalComponent } from './modules/share-on-linkedin/share-on-linkedin-modal/share-on-linkedin-modal.component';

@NgModule({
  declarations: [ManagerComponent, ShareOnLinkedinComponent, ShareOnLinkedinModalComponent],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule,
    DataTableModule,
    DynamicDataTableModule,
  ]
})
export class ManagerModule { }
