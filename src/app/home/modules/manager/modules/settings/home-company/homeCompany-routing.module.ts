import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeCompanyComponent } from './show-details-company/home-company.component';
import { EditCompanyHomeComponent } from './edit-company-home/edit-company-home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeCompanyComponent,
  },
  {
    path: 'edit-company',
    component: EditCompanyHomeComponent,
    data: {
      breadcrumb: 'edit-company'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeCompanyRoutingModule { }
