import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyBankingInfoComponent } from './edit-company-banking-info/company-banking-info.component';
import { ShowCompanyBankingInfoComponent } from './show-company-banking-info/show-company-banking-info.component';

const routes: Routes = [
  {
    path: '',
    component: ShowCompanyBankingInfoComponent,
    data: {
      breadcrumb: 'company-banking-info'
    },
  },
  {
    path: 'add',
    component: CompanyBankingInfoComponent,
    data: {
      breadcrumb: 'company-banking-info'
    },
  },
  {
    path: 'update',
    component: CompanyBankingInfoComponent,
    data: {
      breadcrumb: 'company-banking-info'
    },
  },
  {
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyBankingInfoRoutingModule { }
