import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExpatriationCertificatesRoutingModule } from './expatriation-certificates-routing.module';
import { ExpatriationCertificatesComponent } from './expatriation-certificates.component';

@NgModule({
  declarations: [ExpatriationCertificatesComponent],
  imports: [
    CommonModule,
    ExpatriationCertificatesRoutingModule
  ]
})
export class ExpatriationCertificatesModule { }
