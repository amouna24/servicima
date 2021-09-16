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
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { CapitalizeFirstLetter } from '@core/services/pipe/capialize-first-letter';
import { ClickOutsideDirective } from '@shared/directives/ClickOutsideDirective';
import { SpliceText } from '@core/services/pipe/splice-text';
import { DisableControlDirective } from '@shared/directives/disabled.directive';
import { TitleSettingsComponent } from '@shared/components/title-settings/title-settings.component';

import { HeaderComponent } from './components/header/header.component';
import { ChangePwdComponent } from './components/settings/changepwd/changepwd.component';
import { UserComponent } from './components/settings/user/user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CanBeDisplayedDirective } from './directives/can-be-displayed.directive';
import { MaterialModule } from './modules/material/material.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { UploadSheetComponent } from './components/upload-sheet/upload-sheet.component';
import { HomeCompanyComponent } from '../home/modules/manager/modules/settings/home-company/show-details-company/home-company.component';
import { AlertComponent } from './components/alert/alert.component';
import { RightSidenaveComponent } from './components/right-sidenave/right-sidenave.component';
import { DynamicComponent } from './components/dynamic-component/dynamic.component';
import { ModalComponent } from './components/modal/modal.component';
import { AddTimesheetComponent } from './components/add-timesheet/add-timesheet.component';
import { EditUserComponent } from './components/settings/edit-user/edit-user.component';
import { ProfileImageComponent } from './components/profile-image/profile-image.component';
import { ModalSocialWebsiteComponent } from './components/modal-social-website/modal-social-website.component';
import { EditCompanyHomeComponent } from '../home/modules/manager/modules/settings/home-company/edit-company-home/edit-company-home.component';
import { SidenavSettingsComponent } from './components/settings/sidenav-settings/sidenav-settings.component';
import { SplashComponent } from './components/splash/splash.component';
import { ErrorComponent } from './components/error/error.component';
import { ResumeManagementModule } from './modules/resume-management/resume-management.module';

@NgModule({
  declarations: [
    /* Components */
    SidenavComponent,
    HeaderComponent,
    ChangePwdComponent,
    UserComponent,
    HomeCompanyComponent,
    ConfirmationModalComponent,
    BreadcrumbComponent,
    ConfirmationModalComponent,
    SkeletonLoaderComponent,
    StepperComponent,
    RightSidenaveComponent,
    AddTimesheetComponent,
    /* Directives */
    CanBeDisplayedDirective,
    ClickOutsideDirective,
    DisableControlDirective,
    CapitalizeFirstLetter,
    SpliceText,
    UploadSheetComponent,
    AlertComponent,
    DynamicComponent,
    ModalComponent,
    ProfileImageComponent,
    EditUserComponent,
    ModalSocialWebsiteComponent,
    EditCompanyHomeComponent,
    SidenavSettingsComponent,
    ErrorComponent,
    SplashComponent,
    ErrorComponent,
    TitleSettingsComponent

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
    MatIconModule,
    MatBottomSheetModule,
    ScrollbarModule,
  ],
  exports: [
    MaterialModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidenavComponent,
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
    ScrollbarModule,
    SidenavSettingsComponent,
    ScrollbarModule,
    DynamicComponent,
    EditCompanyHomeComponent,
    ErrorComponent,
    SplashComponent,
    CapitalizeFirstLetter,
    ClickOutsideDirective,
    SpliceText,
    DisableControlDirective,
    ModalComponent,
    ProfileImageComponent,
    ProfileImageComponent,
    TitleSettingsComponent,
    AddTimesheetComponent,
  ]
})
export class SharedModule { }
