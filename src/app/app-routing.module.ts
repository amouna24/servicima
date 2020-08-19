import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthModule, AuthGuard } from '@widigital-group/auth-npm-front';

import { environment } from 'src/environments/environment';

import { ErrorComponent } from './pages/error/error.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager/dashboard'
    },
    {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard]
    },
   {
        path: 'auth',
        loadChildren: () => import('@widigital-group/auth-npm-front').then(m => m.AuthLibModule)
    },
    {
        path: 'notfound',
        component: NotFoundComponent
    },
    {
        path: 'error',
        component: ErrorComponent
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes),
      AuthModule.forRoot(environment)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
