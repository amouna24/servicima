import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';

@NgModule({
  declarations: [ManagerComponent],
  imports: [
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule { }
