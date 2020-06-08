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
import { UserComponent } from './components/settings/user/user.component';
import { ChangePwdComponent } from './components/settings/changepwd/changepwd.component';
import { UsersListComponent } from './components/settings/usersList/users-list/users-list.component';

@NgModule({
  declarations: [SidenavComponent, HeaderComponent, SpinnerComponent, TranslationPipe,
     UserComponent, ChangePwdComponent, UsersListComponent],
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
    UserComponent,
    ChangePwdComponent,
    UsersListComponent
  ]
})
export class SharedModule { }
