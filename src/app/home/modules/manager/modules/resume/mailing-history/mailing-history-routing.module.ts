import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MailingHistoryComponent } from './mailing-history.component';
import { MailingHistoryDetailsComponent } from './mailing-history-details/mailing-history-details.component';

const routes: Routes = [
  {
    path: '',
    component: MailingHistoryComponent
  },
  {
    path: 'details',
    component: MailingHistoryDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailingHistoryRoutingModule { }
