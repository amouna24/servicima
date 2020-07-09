import { Injectable } from '@angular/core';

import { IViewParam } from '@shared/models/view.model';

import { AppInitializerService } from '../app-initializer/app-initializer.service';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  resList: IViewParam[] = [];
  refData: { } = { };
  constructor(private appInitializerService: AppInitializerService, private localStorageService: LocalStorageService) {

  }

  /**
   * @description get refdata with specific type
   * @param company: company
   * application :application
   * languageId: language id
   * type: array code type example ['GENDER', 'PROF_TITLES', 'PROFILE_TYPE', 'ROLE']]
   */
  getRefData(company: string, application: string, listType: string[]): any {
    const languageId = this.localStorageService.getItem('language').langId;
    listType.forEach((type) => {
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
  getApplicationID(applicationCode: string): string {
    return this.appInitializerService.applicationList
      .find(value => value.ApplicationKey.application_code === applicationCode)._id;
  }

  /**************************************************************************
   * @description Get Company ID
   * @param COMPANY_EMAIL the email_address
   * @param APPLICATION_CODE of Application
   * @return ID of company
   *************************************************************************/
  getCompanyId(companyEmail: string, applicationCode?: string): string {
    return this.appInitializerService.companyList
      .find(value =>
        value.companyKey.email_address === companyEmail &&
        value.companyKey.application_id === this.getApplicationID(applicationCode)
      )._id;
  }
  /**************************************************************************
   * @description Get Application NAME
   * @param APPLICATION_ID the application id
   * @return the NAME of APPLICATION_ID
   *************************************************************************/
  getApplicationName(applicationId: string): string {
    return this.appInitializerService.applicationList
      .find(value => value._id === applicationId).application_desc;
  }

  /**************************************************************************
   * @description Get Company NAME
   * @param COMPANY_ID the companyID
   * @return NAME of company
   *************************************************************************/
  getCompanyName(companyId: string): string {
    return this.appInitializerService.companyList
      .find(value =>
        value._id === companyId
      ).name;
  }

  /**
   * @description:  filter data (languages, gender, legal form ...)
   */
  filterData(refDataList: IViewParam[], refDataFilterCtrl: any, filteredRefData: any): void {
    if (!refDataList) {
      return;
    }
    /* get the search keyword */
    let search = refDataFilterCtrl.value;
    if (!search) {
      filteredRefData.next(refDataList.slice());
      return;
    }
    search = search.toLowerCase();

    /* filter data */
    filteredRefData.next(
      refDataList.filter(refData => refData.viewValue.toLowerCase().indexOf(search) > -1),
    );
  }

  /**
   * @description listen for search field value changes
   */
  changeValueField(list: any[], filterCtrl: any, filtered: any) {
    filterCtrl.valueChanges
      .subscribe(() => {
        this.filterData(list, filterCtrl, filtered);
      });
  }
}
