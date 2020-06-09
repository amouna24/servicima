import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActivityReportsRoutingModule } from './activity-reports-routing.module';
import { ActivityReportsComponent } from './activity-reports.component';

@NgModule({
  declarations: [ActivityReportsComponent],
  imports: [
    CommonModule,
    ActivityReportsRoutingModule
  ]
})
export class ActivityReportsModule { }
