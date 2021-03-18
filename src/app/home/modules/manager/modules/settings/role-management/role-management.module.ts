import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { RoleRoutingModule } from './role-management-routing.module';
import { AddRoleComponent } from './add-role/add-role.component';

@NgModule({
  declarations: [AddRoleComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    SharedModule,
    DataTableModule,
  ]
})
export class RoleManagementModule { }
