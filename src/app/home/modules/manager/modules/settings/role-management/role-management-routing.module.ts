import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleManagementComponent } from './role-management/role-management.component';

const routes: Routes = [

  {
    path: '',
    component: RoleManagementComponent,
    data: {
      breadcrumb: 'role'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
