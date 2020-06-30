import { Injectable } from '@angular/core';

import { IViewParam } from '@shared/models/view.model';

import { AppInitializerService } from '../app-initializer/app-initializer.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  resList: IViewParam[] = [];
  refData: { } = { };
  constructor(private appInitializerService: AppInitializerService) {
  }

  /**
   * @description get refdata with specific type
   */
  getRefData(company, application, languageId, Type): any {
    Type.forEach((type) => {
      this.resList = [];
      let filterRefData = this.appInitializerService.refDataList.filter(
        (element) => {
          if (
            element.RefDataKey.ref_type_id ===
            this.appInitializerService.refTypeList.find(refType => refType.RefTypeKey.ref_type_code === type)._id &&
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
        filterRefData = this.appInitializerService.refDataList.filter(
          element =>
            element.RefDataKey.ref_type_id ===
            this.appInitializerService.refTypeList.find(refType => refType.RefTypeKey.ref_type_code === type)._id &&
            element.RefDataKey.application_id === this.appInitializerService.applicationList
              .find(app => app.ApplicationKey.application_code === 'ALL')._id &&
            element.RefDataKey.company_id === this.appInitializerService.companyList
              .find(comp => comp.companyKey.email_address === 'ALL')._id &&
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
}
