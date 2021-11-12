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

  localTranslationFile: any;
  localStorageLang: any;

  constructor(
    private http: HttpClient,
    public translateService: TranslateService,
    public localStorageService: LocalStorageService,
  ) { }

  /**
   * this method has to be implement to override the ngx-translate original method
   * @param language: string of languageId and keyCode
   */
  getTranslation(language: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      const langId = language.split('-')[0];
      const langCode = language.split('-')[1];
      const langApiPath = `${environment.translateApiUrl}?language_id=${langId}`;
      this.http.get(langApiPath).subscribe(
        (data: object[]) => {
          this.getLocalTranslation(langCode).subscribe((localTrad) => {
            // Merge the http translation object with the local one
            const formattedTrad = this.mapTranslationData(data);
            const mergedData = Object.assign(localTrad, formattedTrad);
            observer.next(mergedData);
            observer.complete();
          });
        },
        (err) => {
          console.log(err);
        },
      );
    });
  }

  /**
   * Get the local Translation file
   */
  getLocalTranslation(langCode: string): Observable<any> {
    return new Observable((o: Observer<any>) => {
     /* if (this.localTranslationFile) {
        o.next(this.localTranslationFile);
        o.complete();
      } */
        this.http.get(`./assets/i18n/${langCode}.json`).subscribe(
          (data) => {
            this.localTranslationFile = data;
            o.next(this.localTranslationFile);
            o.complete();
          },
          () => {
            o.next({ });
            o.complete();
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
    this.localStorageLang = localStorage.getItem('language');
    this.localStorageLang = JSON.parse(this.localStorageLang);
    const langCode = !!this.localStorageLang ?
      this.localStorageLang['langCode'] :
      this.translateService.getBrowserLang().toUpperCase();
    const language = this.checkForLanguage(langCode);
    const langCombined = `${language._id}-${language.LanguageKey.language_code}`;
    this.translateService.use(langCombined);
    if (!this.localStorageLang) {
      this.localStorageService.setItem('language', {
        langCode: language.LanguageKey.language_code,
        langId: language._id,
      });
    }
  }

  /**
   * Get the stored language from localStorage
   */
  getLanguages(): IAppLanguage[] {
    return this.localStorageService.getItem('languages');
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
  /**
   * Get All language stored
   */
  getAllLanguages() {
    return this.http.get<any>(`${environment.languageApiUrl}`);

  }
}
