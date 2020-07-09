import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { HttpReqInterceptorService } from '@core/services/http-req-interceptor/http-req-interceptor.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { TranslationCustomLoaderService } from '@core/services/translation/translation-custom-loader.service';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorComponent } from './pages/error/error.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export function setupApp(
  translationCustomLoaderService: TranslationCustomLoaderService,
  localStorageService: LocalStorageService,
  appInitService: AppInitializerService
) {
  return () => appInitService.initializeApp();
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationCustomLoaderService,
        deps: [HttpClient, LocalStorageService]
      },
      useDefaultLang: true
    }),
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: setupApp,
      deps: [TranslationCustomLoaderService, LocalStorageService, AppInitializerService],
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
