import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { BuyLicenceComponent } from './licence/buy-licence/buy-licence.component';
import { CompleteUpgradeLicenceComponent } from './licence/complete-upgrade-licence/complete-upgrade-licence.component';
import { UpgradeLicenceComponent } from './licence/upgrade-licence/upgrade-licence.component';
import { LicenceExpirationComponent } from './licence/licence-expiration/licence-expiration.component';
import { LicenceManagementComponent } from './licence/licence-management/licence-management.component';
// tslint:disable-next-line:max-line-length
import { PaymentMethodsManagementComponent } from './payment/payment-methods-management/payment-methods-management/payment-methods-management.component';
import { PaymentInfoComponent } from './payment/payment-info/payment-info-company-management/payment-info.component';
import { RoleManagementComponent } from './role-management/role-management/role-management.component';
import { TimesheetManagementComponent } from './timesheet management/timesheet-management/timesheet-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyBankingInfoComponent } from './company-banking-info/edit-company-banking-info/company-banking-info.component';

@NgModule({
  declarations: [
    SettingsComponent,
    BuyLicenceComponent,
    CompleteUpgradeLicenceComponent,
    UpgradeLicenceComponent,
    LicenceExpirationComponent,
    LicenceManagementComponent,
    PaymentMethodsManagementComponent,
    PaymentInfoComponent,
    RoleManagementComponent,
    TimesheetManagementComponent,
    DashboardComponent,
    CompanyBankingInfoComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    DataTableModule,
    DynamicDataTableModule,
  ],
})
export class SettingsModule {
}
