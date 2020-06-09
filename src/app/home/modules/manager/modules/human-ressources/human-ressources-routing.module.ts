import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HumanRessourcesComponent } from './human-ressources.component';


const routes: Routes = [
  {
    path: '',
    component: HumanRessourcesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumanRessourcesRoutingModule { }
