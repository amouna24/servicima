import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()

export class DataTableService {

  applicationId = '5eac544a92809d7cd5dae21f';
  languageId = '5eac544ad4cb666637fe1353';

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
      return { prop: config.dataListKey.column_code, name: config.column_desc };
    });
  }
}
