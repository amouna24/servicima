import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { CollaboraterRoutingModule } from './collaborater-routing.module';
import { CollaboraterComponent } from './collaborater.component';

@NgModule({
  declarations: [CollaboraterComponent],
  imports: [
    CommonModule,
    SharedModule,
    CollaboraterRoutingModule
  ]
})
export class CollaboraterModule { }
