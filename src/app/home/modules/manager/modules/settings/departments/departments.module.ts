import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { DepartmentsComponent } from './departments.component';
import { DepartmentsRoutingModule } from './departments-routing.module';

@NgModule({
  declarations: [
    DepartmentsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DepartmentsRoutingModule,
    DynamicDataTableModule,
  ],
})
export class DepartmentsModule {
}
