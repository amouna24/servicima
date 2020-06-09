import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VisaFilesRoutingModule } from './visa-files-routing.module';
import { VisaFilesComponent } from './visa-files.component';

@NgModule({
  declarations: [VisaFilesComponent],
  imports: [
    CommonModule,
    VisaFilesRoutingModule
  ]
})
export class VisaFilesModule { }
