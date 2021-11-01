import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { ResumeRoutingModule } from './resume-routing.module';
import { ResumeComponent } from './resume.component';
import { MailingHistoryComponent } from './mailing-history/mailing-history.component';

@NgModule({
  declarations: [ResumeComponent, MailingHistoryComponent],
  imports: [
    CommonModule,
    ResumeRoutingModule,
    DynamicDataTableModule
  ],
  providers: [
    DatePipe,
]})
export class ResumeModule { }
