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
            this.resList.push({ value: element.RefDataKey.ref_data_code, viewValue: element.ref_data_desc });
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

  /*----------- IT WORKS FOR ANY APPLICATIONS AND COMPANY -------------*/

  /**************************************************************************
   * @description Get Application ID
   * @param APPLICATION_CODE the application code
   * @return the ID of APPLICATION_CODE
   *************************************************************************/
  getApplicationID(APPLICATION_CODE: string): string {
    return this.appInitializerService.applicationList
      .find(value => value.ApplicationKey.application_code === APPLICATION_CODE)._id;
  }

  /**************************************************************************
   * @description Get Company ID
   * @param COMPANY_EMAIL the email_address
   * @param APPLICATION_CODE of Application
   * @return ID of company
   *************************************************************************/
  getCompanyId(COMPANY_EMAIL: string, APPLICATION_CODE?: string): string {
    return this.appInitializerService.companyList
      .find(value =>
        value.companyKey.email_address === COMPANY_EMAIL &&
        value.companyKey.application_id === this.getApplicationID(APPLICATION_CODE)
      )._id;
  }
  /**************************************************************************
   * @description Get Application NAME
   * @param APPLICATION_ID the application id
   * @return the NAME of APPLICATION_ID
   *************************************************************************/
  getApplicationName(APPLICATION_ID: string): string {
    return this.appInitializerService.applicationList
      .find(value => value._id === APPLICATION_ID).application_desc;
  }

  /**************************************************************************
   * @description Get Company NAME
   * @param COMPANY_ID the companyID
   * @return NAME of company
   *************************************************************************/
  getCompanyName(COMPANY_ID: string): string {
    return this.appInitializerService.companyList
      .find(value =>
        value._id === COMPANY_ID
      ).name;
  }
  /*-----------------------------------------------------------------------*/
}
