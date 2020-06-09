import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EvaluationsRoutingModule } from './evaluations-routing.module';
import { EvaluationsComponent } from './evaluations.component';

@NgModule({
  declarations: [EvaluationsComponent],
  imports: [
    CommonModule,
    EvaluationsRoutingModule
  ]
})
export class EvaluationsModule { }
