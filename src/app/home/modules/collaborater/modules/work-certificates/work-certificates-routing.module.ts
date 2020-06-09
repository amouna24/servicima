import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkCertificatesComponent } from './work-certificates.component';


const routes: Routes = [
  {
    path: '',
    component: WorkCertificatesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCertificatesRoutingModule { }
