import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../storage/local-storage.service';
import { TranslationCustomLoaderService } from '../translation/translation-custom-loader.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private translationCustomLoaderService: TranslationCustomLoaderService,
    private router: Router
  ) { }

  initializeApp(): void {
    this.httpClient.get(environment.loadAuthStarterDataApiUrl).subscribe(
      (data) => {
        this.localStorageService.setItem('data', data);
        this.translationCustomLoaderService.setTranslationLanguage();
      },
      (err) => {
        console.error(err);
        this.router.navigate(['/error']);
      },
    );
  }
}
