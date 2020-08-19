import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HumanRessourcesComponent } from './human-ressources.component';

const routes: Routes = [
  {
    path: '',
    component: HumanRessourcesComponent,
    data: {
      breadcrumb: 'human-resources'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumanRessourcesRoutingModule { }
