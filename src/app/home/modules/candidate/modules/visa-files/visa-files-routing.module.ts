import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisaFilesComponent } from './visa-files.component';

const routes: Routes = [
  {
    path: '',
    component: VisaFilesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisaFilesRoutingModule { }
