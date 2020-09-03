import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { UserListRoutingModule } from './users-list-routing.module';
import { UsersListComponent } from './users-list.component';

@NgModule({
  declarations: [UsersListComponent
  ],
  imports: [
    CommonModule,
    UserListRoutingModule,
    SharedModule,
    DataTableModule,
  ],
})
export class UserListModule {
}
