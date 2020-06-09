import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpatriationCertificatesComponent } from './expatriation-certificates.component';


const routes: Routes = [
  {
    path: '',
    component: ExpatriationCertificatesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpatriationCertificatesRoutingModule { }
