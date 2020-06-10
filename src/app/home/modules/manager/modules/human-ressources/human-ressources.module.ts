import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HumanRessourcesRoutingModule } from './human-ressources-routing.module';
import { HumanRessourcesComponent } from './human-ressources.component';

@NgModule({
  declarations: [HumanRessourcesComponent],
  imports: [
    CommonModule,
    HumanRessourcesRoutingModule
  ]
})
export class HumanRessourcesModule { }
