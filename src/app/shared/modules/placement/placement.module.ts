import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacementRoutingModule } from './placement-routing.module';
import { PlacementComponent } from './placement.component';


@NgModule({
  declarations: [PlacementComponent],
  imports: [
    CommonModule,
    PlacementRoutingModule
  ]
})
export class PlacementModule { }
