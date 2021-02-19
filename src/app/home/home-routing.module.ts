import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from '@shared/components/settings/edit-user/edit-user.component';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'manager',
        loadChildren: () => import('./modules/manager/manager.module').then(m => m.ManagerModule),
        data: {
          breadcrumb: 'home'
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
