import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { TranslationPipe } from './pipes/translation/translation.pipe';

@NgModule({
  declarations: [SidenavComponent, HeaderComponent, SpinnerComponent, TranslationPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
  ],
  exports: [
    MaterialModule,
    CommonModule,
    HeaderComponent,
    SidenavComponent,
    SpinnerComponent,
    TranslationPipe
  ]
})
export class SharedModule { }
