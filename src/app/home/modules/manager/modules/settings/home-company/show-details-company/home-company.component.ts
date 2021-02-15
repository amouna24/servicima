import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilsService } from '@core/services/utils/utils.service';
import { FormGroup } from '@angular/forms';
import { ICompanyModel } from '@shared/models/company.model';
import { IUserModel } from '@shared/models/user.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { Subscription } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { ModalService } from '@core/services/modal/modal.service';
import { ModalSocialWebsiteComponent } from '@shared/components/modal-social-website/modal-social-website.component';
@Component({
  selector: 'wid-home-company',
  templateUrl: './home-company.component.html',
  styleUrls: ['./home-company.component.scss']
})
export class HomeCompanyComponent implements OnInit, OnDestroy {

  constructor(private utilsService: UtilsService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private assetsDataService: AssetsDataService,
              private appInitializerService: AppInitializerService,
              private modalService: ModalService,
  ) {
    this.modalService.registerModals(
      { modalName: 'AddLink', modalComponent: ModalSocialWebsiteComponent});
  }

  userCredentials: string;
  company: ICompanyModel;
  userInfo: IUserInfo;
  companyId: string;
  applicationId: string;
  languageId: string;
  lang: string;
  languages: IViewParam[];
  user: IUserModel;
  form: FormGroup;
  currency: string;
  country: string;
  vat: string;
  countryList: IViewParam[] = [];
  legalFormList: IViewParam[] = [];
  vatList: IViewParam[] = [];
  activityCodeList: IViewParam[] = [];
  currenciesList: IViewParam[] = [];
  /** subscription */
  subscription: Subscription;
  /** subscription */
  private subscriptions: Subscription[] = [];

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.mapData();
    this.getRefdata();
    this.userCredentials = this.localStorageService.getItem('userCredentials');
    this.subscriptions.push(this.userService.connectedUser$.subscribe((info) => {
      if (!!info) {
        this.userInfo = info;
        this.languageId = this.userInfo['user'][0]['language_id'];
        this.company = info['company'][0];
        this.user = info['user'][0];
        this.companyId = this.company['_id'];
        this.applicationId = this.company['companyKey']['application_id'];
        this.currency = this.utilsService.getViewValue(this.company['currency_id'], this.currenciesList);
        this.country = this.utilsService.getViewValue(this.company['country_id'], this.countryList);
        this.lang = this.utilsService.getViewValue(this.userInfo['user'][0]['language_id'], this.languages);
        this.vat = this.utilsService.getViewValue(this.company['vat_nbr'], this.vatList);
      }
    }, (err) => console.error(err)));
  }

  /**
   * @description : get the refData from local storage
   */
  getRefdata(): void {
    const list = ['VAT', 'LEGAL_FORM'];
    const refData = this.utilsService.getRefData(this.companyId, this.applicationId,
      list);
    this.legalFormList = refData['LEGAL_FORM'];
    this.vatList = refData['VAT'];
  }

  /**
   * @description: : mapping data
   */
  mapData(): void {
    this.countryList = this.appInitializerService.countriesList.map((country) => {
      return { value: country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC };
    });
    this.activityCodeList = this.appInitializerService.activityCodeList.map((Code) => {
      return { value: Code.NAF, viewValue: Code.NAF };
    });
    this.currenciesList = this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC };
    });
    this.languages = this.appInitializerService.languageList.map((language) => {
      return ({ value: language._id, viewValue: language.language_desc});
    });
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
  /**
   * @description  : Add link
   */
  addLink(): void {
    this.modalService.displayModal('AddLink', null, '50%', '80%');
  }
}
