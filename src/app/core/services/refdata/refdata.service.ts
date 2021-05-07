import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRefdataModel } from '@shared/models/refdata.model';

import { Observable } from 'rxjs';
import { IMessageCodeModel } from '@shared/models/messageCode.model';
import { IViewParam } from '@shared/models/view.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RefdataService {
  resList: IViewParam[] = [];
  refData: { } = { };
  refdataList = [];
  refDataNotMapping = [];
  constructor(private httpClient: HttpClient,
              private appInitializerService: AppInitializerService,
              private localStorageService: LocalStorageService, ) { }
  /**
   * @description get refData with specific type
   * @param company: company
   * @param application :application
   * @param listType: array code type example ['GENDER', 'PROF_TITLES', 'PROFILE_TYPE', 'ROLE']]
   * @param map: mapping result value and view value or no
   */
    getRefData(company: string, application: string, listType: string[], map?: boolean): Promise<any> {
      let RefDataWithMappingLength = 0;
      let RefDataWithNoMappingLength = 0;
      this.refData = [];
      this.refDataNotMapping = [];
      const languageId = this.localStorageService.getItem('language').langId;
      return  new Promise<any>(resolve =>
        this.getRefDataByType(company, application).subscribe((data) => {
        listType.forEach((type) => {
            this.refdataList = data;
            const filterRefData = this.refdataList.filter(
              (element) => {
                if (
                  (element.RefDataKey.ref_type_id ===
                    this.appInitializerService.refTypeList.find(refType => refType.RefTypeKey.ref_type_code === type)._id) &&
                  element.RefDataKey.language_id === languageId
                ) {
                  return element;
                }
              });
            if (filterRefData.length > 0) {
              if (!map) {
                this.resList = [];
                filterRefData.forEach(
                  (element) => {
                    this.resList.push({ value: element.RefDataKey.ref_data_code, viewValue: element.ref_data_desc });
                  },
                );
                this.refData[type] = this.resList;
                RefDataWithMappingLength ++;
                if (listType.length === RefDataWithMappingLength ) {
                  resolve(this.refData);
                }
              } else {
                RefDataWithNoMappingLength ++;
                this.refDataNotMapping[type] = filterRefData;
                if (listType.length === RefDataWithNoMappingLength) {
                  resolve(this.refDataNotMapping);
                }
              }
            }
          });
        }));
    }

  /**
   * @description get refData with specific refType and code refData
   * @param company: company
   * @param application :application
   * @param refdataCode: code refData
   * @param reftypeId: id refType
   */
  getSpecificRefdata(application: string, company: string, refdataCode: string, reftypeId: string) {
    return this.httpClient
      .get<IRefdataModel[]>
      (`${environment.refDataApiUrl}?application_id=${application}&company_id=${company}&ref_data_code=${refdataCode}&ref_type_id=${reftypeId}`);
  }

  /**
   * @description get refData with specific refType
   * @param company: company
   * @param application :application
   * @param reftypeId: id refType
   */
  getRefDataByType(company: string, application: string) {
    return this.httpClient
      .get<IRefdataModel[]>(`${environment.refDataApiUrl}?company_id=${company}&application_id=${application}`);
  }

  /**
   * @description add refdata
   * @param role: object to add
   */
  addrefdata(role: object) {
    return this.httpClient
      .post(`${environment.refDataApiUrl}`, role);
  }

  /**
   * @description update refdata
   * @param role: object to update
   */
  updaterefdata(role: object) {
    return this.httpClient
      .put(`${environment.refDataApiUrl}`, role);
  }

  /**
   * @description: http request delete if wanna disable the status of the refData
   *               http request put if wanna enable the status of the refData
   * @param id: id refData
   * @param status: status
   * @param updated_by: email user
   */
  refdataChangeStatus(id: string, status: string, updatedBy: string): Observable<IMessageCodeModel> {
    if (status === 'A') {
      return this.httpClient.delete<IMessageCodeModel>(`${environment.refDataApiUrl}/disable?_id=${id}&updated_by=${updatedBy}`);
    } else if (status === 'D') {
      return this.httpClient.put<IMessageCodeModel>(`${environment.refDataApiUrl}/enable?_id=${id}&updated_by=${updatedBy}`, null);
    }
  }
}
