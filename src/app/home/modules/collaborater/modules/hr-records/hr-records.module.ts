import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HrRecordsRoutingModule } from './hr-records-routing.module';
import { HrRecordsComponent } from './hr-records.component';

@NgModule({
  declarations: [HrRecordsComponent],
  imports: [
    CommonModule,
    HrRecordsRoutingModule
  ]
})
export class HrRecordsModule { }
