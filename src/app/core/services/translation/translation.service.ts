import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../storage/local-storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  data: any = {};
  navLanguage: string = navigator.language.substr(0, 2).toUpperCase();

  constructor(private http: HttpClient, private localStorageServ: LocalStorageService) {

  }

  use(langCode): Promise<{}> {
    const lang = this.checkForLanguage(langCode);
    return new Promise<{}>((resolve, reject) => {
      const langPath = `${environment.translateApiURL}?language_id=${lang['_id']}`;
      this.http.get<[]>(langPath).subscribe(
        translation => {
          const translations = this.mapTranslationData(translation);
          this.localStorageServ.setItem('language', lang['LanguageKey']['language_code']);
          this.data = translations;
          this.localStorageServ.setItem('translate', this.data);
          resolve(this.data);
          console.log(this.data);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }

  mapTranslationData(translation: Array<object>): object {
    const transOb = {}
    translation.map(
      (ob: object) => {
        const transKey = ob['TranslateKey']['translate_code'];
        const transValue = ob['translate_content'];
        transOb[transKey] = transValue;
      }
    );
    return transOb;
  }

  getLanguages(): Array<{}> {
    return this.localStorageServ.getItem('data').languages;
  }

  checkForLanguage(langCode: string): any {
    const languages = this.getLanguages();
    const language = languages.find(lang => lang['LanguageKey']['language_code'] === langCode)
    if (language) {
      return language;
    }
    return languages.find(lang => lang['LanguageKey']['language_code'] === 'EN');
  }

  getUsedLanguage(): string {
    console.log(this.localStorageServ.getItem('language'));
    return this.localStorageServ.getItem('language');
  }


}
