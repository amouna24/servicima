import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnnualInterviewsRoutingModule } from './annual-interviews-routing.module';
import { AnnualInterviewsComponent } from './annual-interviews.component';

@NgModule({
  declarations: [AnnualInterviewsComponent],
  imports: [
    CommonModule,
    AnnualInterviewsRoutingModule
  ]
})
export class AnnualInterviewsModule { }
