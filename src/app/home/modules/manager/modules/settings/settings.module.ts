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
import { PaymentMethodsManagementComponent } from './payment/payment-methods-management/payment-methods-management.component';
import { PaymentInfoComponent } from './payment/payment-info/payment-info.component';
import { RoleManagementComponent } from './role-management/role-management.component';

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
