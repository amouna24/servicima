import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerComponent } from './components/manager/manager.component';
import { UserComponent } from '../shared/components/settings/user/user.component';
import { UsersListComponent } from '../shared/components/settings/usersList/users-list/users-list.component';


const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'bills',
        loadChildren: () => import('./bills/bills.module').then(m => m.BillsModule)
      },
      {
        path: 'profile',
        component: UserComponent
      },
      {
        path: 'userslist',
        component: UsersListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
