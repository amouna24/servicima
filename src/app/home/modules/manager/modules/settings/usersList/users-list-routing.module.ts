import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '@shared/components/settings/user/user.component';

import { UsersListComponent } from './users-list.component';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
    data: {
      breadcrumb: 'users'
    },
  },
  {
    path: 'add-user',
    component: UserComponent,
    data: {
      breadcrumb: 'new user'
    },
  },
  {
    path: 'update-user',
    component: UserComponent,
    data: {
      breadcrumb: 'update user'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserListRoutingModule { }
