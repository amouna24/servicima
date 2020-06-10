import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';

import { IAppLanguage } from '@shared/models/app-language';

import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../storage/local-storage.service';

/**
 * Override the ngx-translate HttpLoader Service
 * to get translation data from a http request
 */

@Injectable({
  providedIn: 'root'
})
export class TranslationCustomLoaderService implements TranslateLoader {

  constructor(
    private http: HttpClient,
    public translateService: TranslateService,
    public localStorageService: LocalStorageService,
  ) { }

  /**
   * this method has to be implement to override the ngx-translate original method
   * @param langId: string
   */
  getTranslation(langId: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      const langApiPath = `${environment.translateApiURL}?language_id=${langId}`;
      this.http.get(langApiPath).subscribe(
        (data: object[]) => {
          observer.next(this.mapTranslationData(data));
          observer.complete();
        },
        (err) => {
          console.log(err);
        },
      );
    });
  }

  /**
   * format the returned translated date to be in one object with a key-value format
   * @param translation: object[]
   */
  mapTranslationData(translation: object[]): object {
    const transOb = { };
    translation.map(
      (ob: object) => {
        const translationKey = ob['TranslateKey']['translate_code'];
        transOb[translationKey] = ob['translate_content'];
      }
    );
    return transOb;
  }

  /**
   * Set the global App Lang
   */
  setTranslationLanguage() {
    const navLanguage = navigator.language.substr(0, 2).toUpperCase();
    const language = this.checkForLanguage(navLanguage);
    this.translateService.use(language._id);
  }

  /**
   * Get the stored language from localStorage
   */
  getLanguages(): IAppLanguage[] {
    const language = this.localStorageService.getItem('data').languages;
    return this.localStorageService.getItem('data').languages;
  }

  /**
   * Get the stored languages list from localStorage
   * @param langCode: string
   */
  checkForLanguage(langCode: string): IAppLanguage {
    const languages = this.getLanguages();
    const language: IAppLanguage = languages.find((lang: IAppLanguage) => lang.LanguageKey.language_code === langCode);
    if (language) {
      return language;
    }
    return languages.find((lang: IAppLanguage) => lang.LanguageKey.language_code === 'EN');
  }
}
