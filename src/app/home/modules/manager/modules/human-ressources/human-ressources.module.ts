import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HumanRessourcesRoutingModule } from './human-ressources-routing.module';
import { HumanRessourcesComponent } from './human-ressources.component';
import { CertificationListComponent } from './certification-list/certification-list.component';
import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import { CollaboratorComponent } from './collaborator/collaborator.component';
// tslint:disable-next-line:origin-ordered-imports
import { SharedModule } from '@shared/shared.module';
// tslint:disable-next-line:origin-ordered-imports
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { ListOfCertificationComponent } from './certifications/list-of-certification/list-of-certification.component';
import { EditCertificationComponent } from './certifications/edit-certification/edit-certification.component';
import { ShowCertificationComponent } from './certifications/show-certification/show-certification.component';

@NgModule({
    declarations: [HumanRessourcesComponent,
        CertificationListComponent,
        CollaboratorListComponent,
        CollaboratorComponent,
        ListOfCertificationComponent,
        EditCertificationComponent,
        ShowCertificationComponent],
    exports: [
        CertificationListComponent,
        ListOfCertificationComponent
    ],
  imports: [
    CommonModule,
    HumanRessourcesRoutingModule,
    SharedModule,
    DynamicDataTableModule,
  ]
})
export class HumanRessourcesModule { }
