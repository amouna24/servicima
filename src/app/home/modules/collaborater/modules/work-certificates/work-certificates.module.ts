import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { WorkCertificatesRoutingModule } from './work-certificates-routing.module';
import { WorkCertificatesComponent } from './work-certificates.component';
import { HumanRessourcesModule } from '../../../manager/modules/human-ressources/human-ressources.module';
import { ShowCertificationComponent } from './show-certification/show-certification.component';
import { EditCertificationComponent } from './edit-certification/edit-certification.component';

@NgModule({
  declarations: [WorkCertificatesComponent, ShowCertificationComponent, EditCertificationComponent],
    imports: [
        CommonModule,
        WorkCertificatesRoutingModule,
        HumanRessourcesModule,
        SharedModule,
    ]
})
export class WorkCertificatesModule { }
