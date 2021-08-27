import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { CompanyBankingInfoRoutingModule } from './companyBankingInfo-routing.module';
import { ShowCompanyBankingInfoComponent } from './show-company-banking-info/show-company-banking-info.component';
@NgModule({
  declarations: [ShowCompanyBankingInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    CompanyBankingInfoRoutingModule,
    DataTableModule,
  ],
})
export class CompanyBankingInfoModule {
}
