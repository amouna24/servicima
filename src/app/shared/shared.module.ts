import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersListComponent } from '@shared/components/settings/usersList/users-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { HeaderComponent } from './components/header/header.component';
import { ChangePwdComponent } from './components/settings/changepwd/changepwd.component';
import { UserComponent } from './components/settings/user/user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CanBeDisplayedDirective } from './directives/can-be-displayed.directive';
import { MaterialModule } from './modules/material/material.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { HomeCompanyComponent } from './components/settings/home-company/home-company.component';

@NgModule({
  declarations: [
    /* Components */
    SidenavComponent,
    HeaderComponent,
    SpinnerComponent,
    UsersListComponent,
    ChangePwdComponent,
    UserComponent,
    HomeCompanyComponent,
    /* Directives */
    CanBeDisplayedDirective,
    ConfirmationModalComponent,

  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({ }),
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    MaterialModule,
    CommonModule,
    HeaderComponent,
    SidenavComponent,
    SpinnerComponent,
    UserComponent,
    ChangePwdComponent,
    HomeCompanyComponent,
    UsersListComponent,
    TranslateModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
