import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TranslationService } from './core/services/translation/translation.service';
import { LocalStorageService } from './core/services/storage/local-storage.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpReqInterceptorService } from './core/services/http-req-interceptor/http-req-interceptor.service';
import { AppInitializerService } from './core/services/app-initializer/app-initializer.service';
import { ErrorComponent } from './pages/error/error.component';

export function setupApp(
  translationServ: TranslationService, localStorageServ: LocalStorageService, appInitServ: AppInitializerService) {
    if (localStorageServ.getItem('data') !== null) {
      return () => translationServ.use(translationServ.getUsedLanguage());
    } else {
      return () => appInitServ.initializeApp();
    }
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ErrorComponent,
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
      useFactory: setupApp,
      deps: [TranslationService, LocalStorageService, AppInitializerService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpReqInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
