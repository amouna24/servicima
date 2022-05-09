import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from '@shared/components/settings/user/user.component';
import { EditUserComponent } from '@shared/components/settings/edit-user/edit-user.component';
import { ConnectionComponent } from '@shared/components/settings/connection/connection.component';

const routes: Routes = [

      {
        path: 'profile',
        component: UserComponent,
        data: {
          breadcrumb: 'profile'
        },
      },
      {
        path: 'edit-profile',
        component: EditUserComponent,
        data: {
          breadcrumb: 'edit-profile'
        },
      },
      {
        path: 'connection',
        component: ConnectionComponent,
        data: {
          breadcrumb: 'connection'
        },
      },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
