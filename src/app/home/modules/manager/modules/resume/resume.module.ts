import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { ResumeRoutingModule } from './resume-routing.module';
import { ResumeComponent } from './resume.component';

@NgModule({
  declarations: [ResumeComponent],
  imports: [
    CommonModule,
    ResumeRoutingModule,
    DynamicDataTableModule
  ],
  providers: [
    DatePipe,
]})
export class ResumeModule { }
