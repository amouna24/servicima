import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { SharedModule } from '@shared/shared.module';

import { ResumeRoutingModule } from './resume-routing.module';
import { ResumeComponent } from './resume.component';
import { MailingHistoryComponent } from './mailing-history/mailing-history.component';
import { MailingHistoryDetailsComponent } from './mailing-history/mailing-history-details/mailing-history-details.component';
@NgModule({
  declarations: [ResumeComponent, MailingHistoryComponent, MailingHistoryDetailsComponent],
  imports: [
    CommonModule,
    ResumeRoutingModule,
    DynamicDataTableModule,
    SharedModule,
  ],
  providers: [
    DatePipe,
]})
export class ResumeModule { }
