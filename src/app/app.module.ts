import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { TranslationService } from './core/services/translation/translation.service';
import { LocalStorageService } from './core/services/storage/local-storage.service';
import { HttpClientModule } from '@angular/common/http';

export function setupTranslateFactory(
  translationServ: TranslationService, localStorageServ: LocalStorageService): Function {
  if (localStorageServ.getItem('lang') !== null) {
    return () => translationServ.use(localStorageServ.getItem('lang'));
  } else {
    return () => translationServ.use('en');
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslationService, LocalStorageService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
