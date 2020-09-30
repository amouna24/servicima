import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*import { AuthModule } from '@widigital-group/auth-npm-front';*/
import { AuthGuard } from '@core/guard/auth.guard';

import { environment } from 'src/environments/environment';

import { ErrorComponent } from './pages/error/error.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthModule } from '../../projects/auth-front-lib/src/public-api';

const routes: Routes = [

    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    },
   {
        path: 'auth',
        loadChildren: () => import('../../projects/auth-front-lib/src/public-api').then(m => m.AuthLibModule),
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
      RouterModule.forRoot(routes, { enableTracing: false}),
      AuthModule.forRoot(environment)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
