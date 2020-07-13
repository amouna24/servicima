import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DataTableComponent } from './components/data-table/data-table.component';
import { DataTableService } from './services/data-table.service';
import { ConfigurationModalComponent } from './components/configuration-modal/configuration-modal.component';

@NgModule({
  declarations: [DataTableComponent, ConfigurationModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexLayoutModule
  ],
  providers: [
    DataTableService
  ],
  exports: [DataTableComponent]
})
export class DataTableModule { }
