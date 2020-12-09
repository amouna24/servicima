import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard/auth.guard';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      breadcrumb: 'home'
    },
    children: [
      {
        path: 'manager',
        loadChildren: () => import('./modules/manager/manager.module').then(m => m.ManagerModule),
        data: {
          breadcrumb: 'manager'
        },
      },
      {
        path: 'collaborator',
        loadChildren: () => import('./modules/collaborater/collaborater.module').then(m => m.CollaboraterModule)
      },
      {
        path: 'candidate',
        loadChildren: () => import('./modules/candidate/candidate.module').then(m => m.CandidateModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
