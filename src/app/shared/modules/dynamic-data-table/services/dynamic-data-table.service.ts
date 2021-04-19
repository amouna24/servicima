import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicDataTableService {

  applicationId: string;
  languageId: string;

  constructor(private httpClient: HttpClient,
              private localStorageService: LocalStorageService, ) {
  }

  getDefaultTableConfig(tableCode: string): Observable<any> {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
    this.languageId = this.localStorageService.getItem('language').langId;
    return this.httpClient.get(`${environment.dataListsUrl}?application_id=${this.applicationId}&` +
      `language_id=${this.languageId}&data_table_code=${tableCode}`);
  }

  getDefaultDisplayedColumns(defaultConfigs: any[]): any[] {
    return defaultConfigs.filter((config) => {
      return config.displayed === 'Y';
    });
  }

  getCanBeDisplayedColumns(defaultConfigs: any[]): any[] {
    return defaultConfigs.filter((config) => {
      return config.can_be_displayed === 'Y';
    });
  }

  getCanBeFiltredColumns(defaultConfigs: any[]): any[] {
    return defaultConfigs.filter((config) => {
      return config.can_be_filtred === 'Y';
    });
  }

  generateColumns(configs: any[]): any[] {
    return configs.map((config) => {
      return { prop: config.dataListKey.column_code, name: config.column_desc, type: config.type || null };
    });
  }

  generateColumnsList(configs: any[]): any[] {
    return configs.map((config) => {
      return  config.dataListKey.column_code;
    });
  }
}
