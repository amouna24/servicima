import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  data: any = {};
  navLanguage: string = navigator.language.substr(0, 2).toUpperCase();

  constructor(private http: HttpClient) { }

  use(lang: string): Promise<{}> {
    console.log(this.navLanguage);
    return new Promise<{}>((resolve, reject) => {
      const langPath = `assets/i18n/${lang || 'en'}.json`;
      this.http.get<{}>(langPath).subscribe(
        translation => {
          console.log(translation);
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }
}
