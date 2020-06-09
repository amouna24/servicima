import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerComponent } from './manager.component';
import { UserComponent } from 'src/app/shared/components/settings/user/user.component';
import { UsersListComponent } from 'src/app/shared/components/settings/usersList/users-list/users-list.component';



const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'activity-reports',
        loadChildren: () => import('./modules/activity-reports/activity-reports.module').then(m => m.ActivityReportsModule)
      },
      {
        path: 'billings',
        loadChildren: () => import('./modules/billings/billings.module').then(m => m.BillingsModule)
      },
      {
        path: 'contract-management',
        loadChildren: () => import('./modules/contract-management/contract-management.module').then(m => m.ContractManagementModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.module').then(m => m.ExpensesModule)
      },
      {
        path: 'human-ressources',
        loadChildren: () => import('./modules/human-ressources/human-ressources.module').then(m => m.HumanRessourcesModule)
      },
      {
        path: 'placements',
        loadChildren: () => import('../../../shared/modules/placement/placement.module').then(m => m.PlacementModule)
      },
      {
        path: 'recruitment',
        loadChildren: () => import('./modules/recruitment/recruitment.module').then(m => m.RecruitmentModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
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
