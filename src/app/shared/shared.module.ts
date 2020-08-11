import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

import { UsersListComponent } from '@shared/components/settings/usersList/users-list.component';

import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

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
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

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
    ConfirmationModalComponent,
    BreadcrumbComponent,
    ConfirmationModalComponent,
    SkeletonLoaderComponent,
    /* Directives */
    CanBeDisplayedDirective

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
    NgxMatSelectSearchModule,
    FormsModule,
    NgxDatatableModule,
    FormsModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    MaterialModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidenavComponent,
    SpinnerComponent,
    UserComponent,
    ChangePwdComponent,
    HomeCompanyComponent,
    UsersListComponent,
    TranslateModule,
    NgxDatatableModule,
    FlexLayoutModule,
    FormsModule,
    SkeletonLoaderComponent,
    BreadcrumbComponent,
    NgxMatSelectSearchModule,
  ]
})
export class SharedModule { }
