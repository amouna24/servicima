import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ErrorComponent } from './pages/error/error.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manager/dashboard'
    },
    {
        path: 'manager',
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule)
    },
    {
        path: 'collaborater',
        loadChildren: () => import('./collaborater/collaborater.module').then(m => m.CollaboraterModule)
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
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }