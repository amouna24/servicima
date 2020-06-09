import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
