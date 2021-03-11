import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { AssetsDataService } from '@core/services/assets-data/assets-data.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UploadService } from '@core/services/upload/upload.service';
import { ModalService } from '@core/services/modal/modal.service';
import { SocialNetwork } from '@core/services/utils/social-network';

import { ICompanyModel } from '@shared/models/company.model';
import { IUserModel } from '@shared/models/user.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { IViewParam } from '@shared/models/view.model';
import { INetworkSocial } from '@shared/models/social-network.model';

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
              private  socialNetwork: SocialNetwork,
              private uploadService: UploadService,
) { }

  userCredentials: string;
  company: ICompanyModel;
  userInfo: IUserInfo;
  companyId: string;
  applicationId: string;
  languageId: string;
  descLanguage: string;
  languages: IViewParam[];
  user: IUserModel;
  form: FormGroup;
  currency: string;
  country: string;
  vat: string;
  avatar: any;
  countryList: IViewParam[] = [];
  legalFormList: IViewParam[] = [];
  vatList: IViewParam[] = [];
  activityCodeList: IViewParam[] = [];
  currenciesList: IViewParam[] = [];
  leftList: INetworkSocial[];
  rightList: INetworkSocial[];
  /** subscription */
  subscription: Subscription;
  showList = [];
  /** subscription */
  private subscriptions: Subscription[] = [];
  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.modalService.registerModals(
      { modalName: 'AddLink', modalComponent: ModalSocialWebsiteComponent});
    this.userCredentials = this.localStorageService.getItem('userCredentials');
    this.mapData();
    this.getRefData();
    this.getDetailsCompany();
  }

  /**
   * @description : get details company
   */
  getDetailsCompany(): void {
    this.subscriptions.push(this.userService.connectedUser$.subscribe(async (info) => {
      if (!!info) {
        this.userInfo = info;
        this.languageId = this.userInfo['user'][0]['language_id'];
        this.company = info['company'][0];
        const ava = await this.uploadService.getImage(this.company['photo']);
        this.avatar = ava;
        this.user = info['user'][0];
        this.getListNetworkSocial(this.company, 'company');
        this.companyId = this.company['_id'];
        this.applicationId = this.company['companyKey']['application_id'];
        this.currency = this.utilsService.getViewValue(this.company['currency_id'], this.currenciesList);
        this.country = this.utilsService.getViewValue(this.company['country_id'], this.countryList);
        this.descLanguage = this.utilsService.getViewValue(this.userInfo['user'][0]['language_id'], this.languages);
        this.vat = this.utilsService.getViewValue(this.company['vat_nbr'], this.vatList);
      }
    }, (err) => console.error(err)));
  }
  /**
   * @description : get the refData from local storage
   */
  getRefData(): void {
    const list = ['VAT', 'LEGAL_FORM'];
    const refData = this.utilsService.getRefData(this.companyId, this.applicationId,
      list);
    this.legalFormList = refData['LEGAL_FORM'];
    this.vatList = refData['VAT'];
  }

  /**
   * @description: mapping data
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
   * @description  : Add link
   */
  addLink(): void {
    this.modalService.displayModal('AddLink', this.company, '620px', '535px').subscribe((company) => {
      if (company) {
        this.socialNetwork.updateNetworkSocial(this.company, company);
        this.getListNetworkSocial(this.company, 'company');
      }
    });
  }

  getListNetworkSocial(value, placeholder) {
    this.leftList = [];
    this.rightList = [];
    const list = this.socialNetwork.getListNetwork(value, placeholder);

    this.socialNetwork.getList(list, this.leftList, this.rightList);
    this.showList = [ ...this.leftList, ...this.rightList];
    this.showList = this.showList.filter((item) => {
      if (item.value !==  'link' ) {
        return item;
      }
    });
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}
