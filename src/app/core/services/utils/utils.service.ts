import { Injectable } from '@angular/core';

import { IViewParam } from '@shared/models/view.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { AppInitializerService } from '../app-initializer/app-initializer.service';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  resList: IViewParam[] = [];
  refData: { } = { };

  constructor(
    private appInitializerService: AppInitializerService,
    private localStorageService: LocalStorageService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {

  }

  /**
   * @description get refData with specific type
   * @param company: company
   * application :application
   * languageId: language id
   * type: array code type example ['GENDER', 'PROF_TITLES', 'PROFILE_TYPE', 'ROLE']]
   */
  getRefData(company: string, application: string, listType: string[], map?: boolean): any {
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
        if (!map) {
          filterRefData.forEach(
            (element) => {
              this.resList.push({ value: element.RefDataKey.ref_data_code, viewValue: element.ref_data_desc});
            },
          );
          return this.refData[type] = this.resList;
        } else {
          return this.refData[String(`${type}`)] = filterRefData;
        }
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
        if (map) {
          this.refData[String(`${type}`)] = filterRefData;
        } else {
          filterRefData.forEach(
            (element) => {
              this.resList.push({ value: element.RefDataKey.ref_data_code, viewValue: element.ref_data_desc});
            },
          );
          this.refData[String(`${type}`)] = this.resList;
        }
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
    console.log('here', filterCtrl.value);
    filterCtrl.valueChanges
      .subscribe(
        (res) => {
        console.log('res', res);
        this.filterData(list, filterCtrl, filtered);
      },
        (e) => {
          console.log('e', e);
        }
        );
  }

  /**
   * @description calculate difference date between two date
   */
  differenceDay(date1: Date, date2: number): number {
    const endDate: any = new Date(date1);
    const startDate: any = new Date(date2);
    let days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (days < 0) {
      days = 0;
      return days;
    }
    return days;
  }

  /**
   * @description Add icon
   * @param name; name
   * @param path :path
   */
  addIcon(listOfIcons): void {
    listOfIcons.forEach(
      (icon) => {
        this.matIconRegistry.addSvgIcon(
          icon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
        );
      }
    );

  }
}
