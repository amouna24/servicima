import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { IError } from '@shared/models/error.model';
import { IViewParam } from '@shared/models/view.model';
import { IIcon } from '@shared/models/icon.model';
import { ICompanyModel } from '@shared/models/company.model';

import { errorPages } from '@shared/statics/error-pages.static';
import { iconsList } from '@shared/statics/list-icons.static';

import { AppInitializerService } from '../app-initializer/app-initializer.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { environment } from '../../../../environments/environment';
// tslint:disable-next-line:origin-ordered-imports
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private appInitializerService: AppInitializerService,
    private localStorageService: LocalStorageService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private matSnackBar: MatSnackBar,
    private httpClient: HttpClient,
  ) {

  }
  companiesList: ICompanyModel[];

  /*----------- IT WORKS FOR ANY APPLICATIONS AND COMPANY -------------*/

  /**************************************************************************
   * @description Get Application ID
   * @param applicationCode the application code
   * @return the ID of APPLICATION_CODE
   *************************************************************************/
  getApplicationID(applicationCode: string): string {
    return this.appInitializerService.applicationList
      .find(value => value.ApplicationKey.application_code === applicationCode)._id;
  }
  /**************************************************************************
   * @description Get companies
   * @return All companies
   *************************************************************************/
   getCompanies(companyEmail: string) {
    return this.httpClient
      .get<any>(`${environment.companyApiUrl}?email_address=${companyEmail}&email_address=ALL`).subscribe((company) => {
        this.companiesList = company;
      });
  }
  /**************************************************************************
   * @description Get Company ID
   * @param companyEmail the email_address
   * @param applicationId Application id
   * @return ID of company
   *************************************************************************/
  getCompanyId(companyEmail: string, applicationId?: string): string {
    return this.companiesList
      .find(value =>
        value.companyKey.email_address === companyEmail &&
        value.companyKey.application_id === applicationId
      )._id;
  }

  /**
   * @description get country
   * @params lang: language code
   */
  getNationality(lang: string) {
    return this.appInitializerService.nationalitiesList.filter(
      element => element['LANGUAGE_CODE'] === lang);
  }

  /**************************************************************************
   * @description Get Application NAME
   * @param applicationId the application id
   * @return the NAME of APPLICATION_ID
   *************************************************************************/
  getApplicationName(applicationId: string): string {
    return this.appInitializerService.applicationList
      .find(value => value._id === applicationId).application_desc;
  }

  /**************************************************************************
   * @description Get Company NAME
   * @param companyId the companyID
   * @return NAME of company
   *************************************************************************/
  getCompanyName(companyId: string): string {
    return this.appInitializerService.companyList
      .find(value =>
        value._id === companyId
      ).company_name;
  }

  /**************************************************************************
   * @description Get refType id
   * @param type: type code of refType
   * @return id of retype
   *************************************************************************/
  getRefTypeId(type) {
    return this.appInitializerService.refTypeList.find(refType => refType.RefTypeKey.ref_type_code === type)._id;
  }
  /**
   * @description calculate difference date between two date
   * @param date1: date
   * @param date2: date
   * @return difference between two date
   */
  differenceDay(date1: Date, date2: number): number {
    const endDate: any = new Date(date1);
    const startDate: any = new Date(date2);
    let days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (days < 0) {
      days = 0;
      return days;
    }
    return days;
  }

  /**
   * @description Add icon
   * @param listOfIcons;
   */
  initializeIcons(listOfIcons: IIcon[] = iconsList): void {
    listOfIcons.forEach(
      (icon) => {
        this.matIconRegistry.addSvgIcon(
          icon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path),
          { viewBox: icon.viewBox }
        );
      }
    );

  }

  /**
   * @description Open SnackBar
   * @param message;
   *  @param action;
   *  @param duration
   * *
   */
  openSnackBar(message: string, action?: string, duration?: number) {
    this.matSnackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  /**
   * @description hash code
   * @param text;
   * @return hash text;
   */
  hashCode(text: string): string {
    // tslint:disable-next-line:no-bitwise
    return text.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0) + '';
  }

  /**************************************************************************
   * @description get view value
   * @param id: string
   * @param list: array
   * @return view value
   *************************************************************************/
  getViewValue(id: string, list): string {
    if (id) {
      return list
        .find(value =>
          value.value === id
        ).viewValue;
    }
  }

  /**
   * @description get country
   * @params lang: language code
   */
  getCountry(lang: string) {
    return this.appInitializerService.countriesList.filter(
      element => element['LANGUAGE_CODE'] === lang);
  }

  /**
   * @description get code language
   * @param id: language_id
   * @returns code language
   */
  getCodeLanguage(id: string): string {
    return this.appInitializerService.languageList
      .find(language => language._id === id).LanguageKey.language_code;
  }

  /**************************************************************************
   * @description get error page
   * @param errCode: string
   * @return pages of type IError
   *************************************************************************/
  getErrorPage(errCode: string, pages: IError[] = errorPages): IError {
    return pages.find(page => page.code === errCode);
  }

  /**
   * @description remove element
   * @param array: array
   * @returns toRemove element to remove
   */
   removeElement<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  /****************************** Filter list with mat-select ************************/
  /*********************************************************************************** */

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
      .subscribe(
        (res) => {
          console.log('resultat filter ', res);
          this.filterData(list, filterCtrl, filtered);
        },
        (e) => {
          console.log('e', e);
        }
      );
  }
  /**
   * @description check formgroup field
   */
  checkFormGroup(form: AbstractControl, columnFields: string[]): boolean {
    const isValueValid = (field) => form['controls'][field].value !== '' && form['controls'][field].value ;
    return columnFields.every(isValueValid);
  }

}
