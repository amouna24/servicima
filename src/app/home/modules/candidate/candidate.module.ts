import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateComponent } from './candidate.component';

@NgModule({
  declarations: [CandidateComponent],
  imports: [
    CommonModule,
    SharedModule,
    CandidateRoutingModule
  ]
})
export class CandidateModule { }
