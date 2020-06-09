import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FilesRoutingModule } from './files-routing.module';
import { FilesComponent } from './files.component';

@NgModule({
  declarations: [FilesComponent],
  imports: [
    CommonModule,
    FilesRoutingModule
  ]
})
export class FilesModule { }
