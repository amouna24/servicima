import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SalarySlipsRoutingModule } from './salary-slips-routing.module';
import { SalarySlipsComponent } from './salary-slips.component';

@NgModule({
  declarations: [SalarySlipsComponent],
  imports: [
    CommonModule,
    SalarySlipsRoutingModule
  ]
})
export class SalarySlipsModule { }
