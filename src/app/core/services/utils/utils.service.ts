import { Inject, Injectable } from '@angular/core';
import { ApplicationModel } from '../../../shared/model/application.model';
import { CompanyModel } from '../../../shared/model/company.model';
import { LanguageModel } from '../../../shared/model/language.model';
import { LocalStorageService } from '../storage/local-storage.service';
import { TranslationService } from '../translation/translation.service';
import { RefdataModel } from '../../../shared/model/refdata.model';
import { ReftypeModel } from '../../../shared/model/reftype.model';
import { ViewParam } from '../../../shared/model/view.model';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  allDataFromStarterData: any;
  applicationList: ApplicationModel[];
  companyList: CompanyModel[];
  languageList: LanguageModel[];
  refTypeList: ReftypeModel[];
  refDataList: RefdataModel[];
  resList : ViewParam[] = [];
  refData: {} = {};
  constructor(private localStorage: LocalStorageService,
    private translationServ: TranslationService) {
    this.getData();
  }

  /**
   * @description get refdata with specific type
   */
  getRefData(company, application, languageId, Type): any {
    Type.forEach((type) => {
      this.resList = [];
      let filterRefData =this.refDataList.filter(
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
              .find(app => app.ApplicationKey.application_code === 'ALL')._id &&
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
    return this.refData
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


