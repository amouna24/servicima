import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentRoutingModule } from './recruitment-routing.module';
import { RecruitmentComponent } from './recruitment.component';


@NgModule({
  declarations: [RecruitmentComponent],
  imports: [
    CommonModule,
    RecruitmentRoutingModule
  ]
})
export class RecruitmentModule { }
