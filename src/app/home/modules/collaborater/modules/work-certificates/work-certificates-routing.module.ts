import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkCertificatesComponent } from './work-certificates.component';
// tslint:disable-next-line:origin-ordered-imports
import { EditWorkCertificateComponent } from '@shared/modules/work-certificates/edit-work-certificate/edit-work-certificate.component';
// tslint:disable-next-line:origin-ordered-imports
import { ShowWorkCertificateComponent } from '@shared/modules/work-certificates/show-work-certificate/show-work-certificate.component';
// tslint:disable-next-line:origin-ordered-imports
import { RequestWorkCertificateComponent } from '@shared/modules/work-certificates/request-work-certificate/request-work-certificate.component';

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
    component: EditWorkCertificateComponent
  },
  {
    path: 'showCertif',
    component: ShowWorkCertificateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCertificatesRoutingModule { }
