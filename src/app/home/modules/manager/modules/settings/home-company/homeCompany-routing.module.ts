import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeCompanyComponent } from './home-company.component';

const routes: Routes = [
  {
    path: 'home-company',
    component: HomeCompanyComponent,
    data: {
      breadcrumb: 'company'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeCompanyRoutingModule { }
