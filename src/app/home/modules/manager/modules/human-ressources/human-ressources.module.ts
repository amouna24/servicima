import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HumanRessourcesRoutingModule } from './human-ressources-routing.module';
import { HumanRessourcesComponent } from './human-ressources.component';
import { CertificationListComponent } from './certification-list/certification-list.component';
import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import { CollaboratorComponent } from './collaborator/collaborator.component';
// tslint:disable-next-line:origin-ordered-imports
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [HumanRessourcesComponent, CertificationListComponent, CollaboratorListComponent, CollaboratorComponent],
    imports: [
        CommonModule,
        HumanRessourcesRoutingModule,
        SharedModule
    ]
})
export class HumanRessourcesModule { }
