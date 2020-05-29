import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { TranslationPipe } from './pipes/translation/translation.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
  declarations: [SidenavComponent, HeaderComponent, SpinnerComponent, TranslationPipe, UserProfileComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    MaterialModule,
    CommonModule,
    HeaderComponent,
    SidenavComponent,
    SpinnerComponent,
    TranslationPipe,
    UserProfileComponent,
    ChangePasswordComponent
  ]
})
export class SharedModule { }
