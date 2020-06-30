import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ILanguageModel } from '@shared/models/language.model';
import { IApplicationModel } from '@shared/models/application.model';
import { ICompanyModel } from '@shared/models/company.model';
import { IRefdataModel } from '@shared/models/refdata.model';
import { IReftypeModel } from '@shared/models/reftype.model';

import { environment } from '../../../../environments/environment';
import { TranslationCustomLoaderService } from '../translation/translation-custom-loader.service';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  starterData: { };
  languageList: ILanguageModel[];
  applicationList: IApplicationModel[];
  companyList: ICompanyModel[];
  refDataList: IRefdataModel[];
  refTypeList: IReftypeModel[];
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private translationCustomLoaderService: TranslationCustomLoaderService,
    private router: Router
  ) { }

  async initializeApp() {
    await this.httpClient.get(environment.loadAuthStarterDataApiUrl).toPromise().then(
      (data) => {
        this.starterData = data;
        this.applicationList = this.starterData['applications'];
        this.companyList = this.starterData['companyall'];
        this.languageList = this.starterData['languages'];
        this.refDataList = this.starterData['refdataall'];
        this.refTypeList = this.starterData['reftypes'];
        this.localStorageService.setItem('languages', this.languageList);
        this.translationCustomLoaderService.setTranslationLanguage();
      },
      (err) => {
        console.error(err);
        this.router.navigate(['/error']);
      },
    );
  }
}
