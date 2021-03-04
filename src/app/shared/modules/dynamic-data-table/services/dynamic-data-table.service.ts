import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicDataTableService {

  applicationId = '5eac544a92809d7cd5dae21f'; // to do : get the app Id from the user info
  languageId = '5eac544ad4cb666637fe1353'; // to do : get the language Id from the user info

  constructor(private httpClient: HttpClient) {
  }

  getDefaultTableConfig(tableCode: string): Observable<any> {
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
