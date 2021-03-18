import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { TaxRoutingModule } from './tax-routing.module';
import { TaxComponent } from './tax-company-management/tax.component';
import { AddTaxCompanyComponent } from './add-tax-company/add-tax-company.component';

@NgModule({
  declarations: [
    TaxComponent,
    AddTaxCompanyComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TaxRoutingModule,
    DynamicDataTableModule,
  ],
})
export class TaxModule {
}
