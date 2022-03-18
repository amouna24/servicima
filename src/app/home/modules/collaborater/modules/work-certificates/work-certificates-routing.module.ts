import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestWorkCertificateComponent } from '@shared/modules/work-certificates/request-work-certificate/request-work-certificate.component';

import { WorkCertificatesComponent } from './work-certificates.component';

import { ShowCertificationComponent } from './show-certification/show-certification.component';
import { EditCertificationComponent } from './edit-certification/edit-certification.component';

const routes: Routes = [
  {
    path: '',
    component: WorkCertificatesComponent,
  },
  {
    path: 'addCertif',
    component: RequestWorkCertificateComponent
  },
  {
    path: 'editCertif',
    component: EditCertificationComponent
  },
  {
    path: 'showCertif',
    component: ShowCertificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCertificatesRoutingModule { }
