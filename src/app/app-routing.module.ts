import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthModule } from '@widigital-group/auth-npm-front';

// import { AuthModule } from '../../projects/auth-front-lib/src/public-api';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ServerErrorComponent } from './pages/server-error/server-error.component';

const routes: Routes = [

    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    },
   {
        path: 'auth',
        canActivate: [AuthGuard],
        loadChildren: () => import('@widigital-group/auth-npm-front').then(m => m.AuthLibModule),
    },
    {
        path: 'notfound',
        component: NotFoundComponent
    },
    {
        path: 'error',
        component: ServerErrorComponent
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
