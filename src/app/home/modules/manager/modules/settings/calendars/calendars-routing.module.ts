import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarsComponent } from './calendars.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarsRoutingModule { }
