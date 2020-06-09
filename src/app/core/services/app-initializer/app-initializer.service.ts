import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../storage/local-storage.service';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  constructor(private translateServ: TranslationService, private http: HttpClient,
    private localStorageServ: LocalStorageService, private router: Router) { }

  initializeApp(): Promise<any> {
    const promise = this.http.get(environment.loadAuthStarterDataApiUrl)
      .toPromise()
      .then((data) => {
        this.localStorageServ.setItem('data', data);
        const lang = this.translateServ.checkForLanguage(this.translateServ.navLanguage);
        this.localStorageServ.setItem('language', lang['LanguageKey']['language_code']);
        this.translateServ.use(lang['LanguageKey']['language_code']);
        return data;
      }).catch(
        err => {
          this.router.navigate(['/error']);
        }
      );

    return promise;
  }
}
