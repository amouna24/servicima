import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboraterRoutingModule } from './collaborater-routing.module';
import { CollaboraterComponent } from './collaborater.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [CollaboraterComponent],
  imports: [
    CommonModule,
    SharedModule,
    CollaboraterRoutingModule
  ]
})
export class CollaboraterModule { }
