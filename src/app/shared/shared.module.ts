import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material/material.module';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UserComponent } from './components/settings/user/user.component';
import { ChangePwdComponent } from './components/settings/changepwd/changepwd.component';
import { UsersListComponent } from './components/settings/usersList/users-list/users-list.component';
import { TranslationPipe } from './pipes/translation/translation.pipe';
import {CanBeDisplayedDirective} from './directives/can-be-displayed.directive';


@NgModule({
  declarations: [
    /* Components */
    SidenavComponent,
    HeaderComponent,
    SpinnerComponent,
    UsersListComponent,
    ChangePwdComponent,
    UserComponent,
    /* Directives */
    CanBeDisplayedDirective,
    /* Pipes */
    TranslationPipe
  ],
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
