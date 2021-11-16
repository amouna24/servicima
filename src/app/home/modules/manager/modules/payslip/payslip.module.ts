import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { PayslipRoutingModule } from './payslip-routing.module';
import { PayslipListComponent } from './payslip-list/payslip-list.component';
import { PayslipImportComponent } from './payslip-import/payslip-import.component';

@NgModule({
  declarations: [
    PayslipListComponent,
    PayslipImportComponent,
  ],
  imports: [
    CommonModule,
    PayslipRoutingModule,
    SharedModule,
    DynamicDataTableModule
  ]
})
export class PayslipModule { }
