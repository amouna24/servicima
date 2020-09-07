import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '@shared/components/settings/user/user.component';

const routes: Routes = [

      {
        path: 'profile',
        component: UserComponent,
        data: {
          breadcrumb: 'profile'
        },
      },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
