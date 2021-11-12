import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WorkCertificatesRoutingModule } from './work-certificates-routing.module';
import { WorkCertificatesComponent } from './work-certificates.component';
import { HumanRessourcesModule } from '../../../manager/modules/human-ressources/human-ressources.module';

@NgModule({
  declarations: [WorkCertificatesComponent],
    imports: [
        CommonModule,
        WorkCertificatesRoutingModule,
        HumanRessourcesModule
    ]
})
export class WorkCertificatesModule { }
