import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkCertificatesRoutingModule } from './work-certificates-routing.module';
import { WorkCertificatesComponent } from './work-certificates.component';


@NgModule({
  declarations: [WorkCertificatesComponent],
  imports: [
    CommonModule,
    WorkCertificatesRoutingModule
  ]
})
export class WorkCertificatesModule { }
