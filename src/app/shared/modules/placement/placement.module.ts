import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
