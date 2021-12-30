import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDataTableComponent } from '@shared/modules/dynamic-data-table/components/data-table/dynamic-data-table.component';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ScrollbarModule } from '@shared/scrollbar/scrollbar.module';
import { SharedModule } from '@shared/shared.module';

import { DataTableConfigComponent } from './components/data-table-config/data-table-config.component';

@NgModule({
  declarations: [
    DynamicDataTableComponent,
    DataTableConfigComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule,
    ScrollbarModule,
    SharedModule,
  ],
  exports: [
    DynamicDataTableComponent,
  ],
})
export class DynamicDataTableModule { }
