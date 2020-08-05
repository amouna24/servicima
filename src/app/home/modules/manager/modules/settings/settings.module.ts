import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { BuyLicenceComponent } from './buy-licence/buy-licence.component';
import { CompleteUpgradeLicenceComponent } from './complete-upgrade-licence/complete-upgrade-licence.component';
import { UpdateLicenceComponent } from './upgrade-licence/upgrade-licence.component';
import { LicenceExpirationComponent } from './licence-expiration/licence-expiration.component';
import { UserModalComponent } from './user-modal/user-modal.component';

@NgModule({
  declarations: [SettingsComponent,
    BuyLicenceComponent,
    CompleteUpgradeLicenceComponent,
    UpdateLicenceComponent,
    LicenceExpirationComponent,
    UserModalComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
  ],
})
export class SettingsModule {
}
