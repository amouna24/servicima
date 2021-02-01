import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { ScrollbarModule } from '@shared/scrollbar/scrollbar.module';

import { HeaderComponent } from './components/header/header.component';
import { ChangePwdComponent } from './components/settings/changepwd/changepwd.component';
import { UserComponent } from './components/settings/user/user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CanBeDisplayedDirective } from './directives/can-be-displayed.directive';
import { MaterialModule } from './modules/material/material.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { UploadSheetComponent } from './components/upload-sheet/upload-sheet.component';
import { HomeCompanyComponent } from '../home/modules/manager/modules/settings/home-company/home-company.component';
import { AlertComponent } from './components/alert/alert.component';
import { RightSidenaveComponent } from './components/right-sidenave/right-sidenave.component';
import { ModalComponent } from './components/modal/modal.component';
import { DeactivateAccountComponent } from './components/deactivate-account/deactivate-account.component';
import { EditUserComponent } from './components/settings/edit-user/edit-user.component';

@NgModule({
  declarations: [
    /* Components */
    SidenavComponent,
    HeaderComponent,
    SpinnerComponent,
    ChangePwdComponent,
    UserComponent,
    HomeCompanyComponent,
    ConfirmationModalComponent,
    BreadcrumbComponent,
    ConfirmationModalComponent,
    SkeletonLoaderComponent,
    StepperComponent,
    RightSidenaveComponent,
    /* Directives */
    CanBeDisplayedDirective,
    UploadSheetComponent,
    AlertComponent,
    ModalComponent,
    DeactivateAccountComponent,
    EditUserComponent,

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
    NgxMatSelectSearchModule,
    MatIconModule,
    MatBottomSheetModule,
    ScrollbarModule
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
    TranslateModule,
    NgxDatatableModule,
    FlexLayoutModule,
    FormsModule,
    SkeletonLoaderComponent,
    BreadcrumbComponent,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatBottomSheetModule,
    StepperComponent,
    AlertComponent,
    RightSidenaveComponent,
    ScrollbarModule
  ]
})
export class SharedModule { }
