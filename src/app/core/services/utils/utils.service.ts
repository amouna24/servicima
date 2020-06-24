import { Injectable } from '@angular/core';

import { IApplicationModel } from '@shared/models/application.model';
import { ICompanyModel } from '@shared/models/company.model';
import { ILanguageModel } from '@shared/models/language.model';
import { IRefdataModel } from '@shared/models/refdata.model';
import { IReftypeModel } from '@shared/models/reftype.model';
import { IViewParam } from '@shared/models/view.model';

import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  allDataFromStarterData: any;
  applicationList: IApplicationModel[];
  companyList: ICompanyModel[];
  languageList: ILanguageModel[];
  refTypeList: IReftypeModel[];
  refDataList: IRefdataModel[];
  resList: IViewParam[] = [];
  refData: { } = { };
  constructor(private localStorage: LocalStorageService) {
    this.getData();
  }

  /**
   * @description get refdata with specific type
   */
  getRefData(company, application, languageId, Type): any {
    Type.forEach((type) => {
      this.resList = [];
      let filterRefData = this.refDataList.filter(
        (element) => {
          if (
            element.RefDataKey.ref_type_id ===
            this.refTypeList.find(refType => refType.RefTypeKey.ref_type_code === type)._id &&
            element.RefDataKey.application_id === application &&
            element.RefDataKey.company_id === company &&
            element.RefDataKey.language_id === languageId) {
            return element;
          }
        });
      if (filterRefData.length > 0) {
        filterRefData.forEach(
          (element) => {
            this.resList.push({ value: element._id, viewValue: element.ref_data_desc });
          },
        );
        return this.refData[type] = this.resList;
      } else if (filterRefData.length === 0) {
        filterRefData = this.refDataList.filter(
          element =>
            element.RefDataKey.ref_type_id ===
            this.refTypeList.find(refType => refType.RefTypeKey.ref_type_code === type)._id &&
            element.RefDataKey.application_id === this.applicationList
              .find(app => app.applicationKey.application_code === 'ALL')._id &&
            element.RefDataKey.company_id === this.companyList
              .find(comp => comp.CompanyKey.email_adress === 'ALL')._id &&
            element.RefDataKey.language_id === languageId);
        filterRefData.forEach(
          (element) => {
            this.resList.push({ value: element.RefDataKey.ref_data_code, viewValue: element.ref_data_desc });
          },
        );

        this.refData[String(`${type}`)] = this.resList;
      }
    });
    return this.refData;
  }

  /**
   * @description get data from local storage
   */
  getData(): void {
    this.allDataFromStarterData = this.localStorage.getItem('data');
    this.applicationList = this.allDataFromStarterData['applications'];
    this.companyList = this.allDataFromStarterData['companyall'];
    this.refTypeList = this.allDataFromStarterData['reftypes'];
    this.refDataList = this.allDataFromStarterData['refdataall'];
    this.languageList = this.allDataFromStarterData['languages'];
  }

}