import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { HomeCompanyRoutingModule } from './homeCompany-routing.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HomeCompanyRoutingModule,
    DataTableModule,
  ],
})
export class HomeCompanyModule {
}
