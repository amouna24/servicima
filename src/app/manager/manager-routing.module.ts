import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerComponent } from './components/manager/manager.component';
import { UserProfileComponent } from '../shared/components/user-profile/user-profile.component';


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
        component: UserProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
