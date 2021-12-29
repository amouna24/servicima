import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { CalendarsComponent } from './calendars.component';
import { CalendarsRoutingModule } from './calendars-routing.module';

@NgModule({
  declarations: [
    CalendarsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CalendarsRoutingModule,
    DynamicDataTableModule,
  ],
})
export class CalendarsModule {
}
