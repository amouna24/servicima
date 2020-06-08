import { NgModule } from '@angular/core';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './components/manager/manager.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ManagerComponent],
  imports: [
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule { }
