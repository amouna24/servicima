import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '@core/services/modal/modal.service';
import { AuthService } from '@widigital-group/auth-npm-front';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { TranslationCustomLoaderService } from '@core/services/translation/translation-custom-loader.service';
import { UtilsService } from '@core/services/utils/utils.service';

import { environment } from '../environments/environment';
@Component({
  selector: 'wid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  modals = { modalName: 'confirmation', modalComponent: ConfirmationModalComponent };
  title = 'WIDIGITAL ' + environment.env;
  iconsList = [
    { name: 'wi-bag', path: 'assets/icons/bag.svg'},
    { name: 'wi-pen', path: 'assets/icons/pen-solid.svg'},
    { name: 'wi-eye', path: 'assets/icons/eye-solid.svg'},
    { name: 'wi-archive', path: 'assets/icons/user-slash-solid.svg'},
    { name: 'wi-marker', path: 'assets/icons/marker-solid.svg'},
    /* Side Nav */
    { name: 'wi-dashboard', path: 'assets/icons/dashboard.svg'},
    { name: 'wi-recruitment', path: 'assets/icons/recruitment.svg'},
    { name: 'wi-HR', path: 'assets/icons/HR.svg'},
    { name: 'wi-placement', path: 'assets/icons/placement.svg'},
    { name: 'wi-activity-reports', path: 'assets/icons/Activity_Reports.svg'},
    { name: 'wi-contract-management', path: 'assets/icons/Contract_Management.svg'},
    { name: 'wi-billings', path: 'assets/icons/Billing.svg'},
    /* Alert Icons */
    { name: 'wi_alert_error', path: 'assets/icons/error.svg'},
    { name: 'wi_alert_success', path: 'assets/icons/success.svg'},
    { name: 'wi_alert_info', path: 'assets/icons/info.svg'},
    { name: 'wi_alert_help', path: 'assets/icons/help.svg'},
    { name: 'wi_alert_warning', path: 'assets/icons/warning.svg'},
    { name: 'wi-close', path: 'assets/icons/close.svg', viewBox: '0 0 27 50'},
    /* Right-Nav Icons */
    { name: 'wi_company', path: 'assets/icons/building-solid.svg', viewBox: '0 -10 20 45'},
    { name: 'wi_user', path: 'assets/icons/user-solid.svg', viewBox: '0 -10 20 45'},
    { name: 'wi_settings', path: 'assets/icons/cogs-solid.svg', viewBox: '0 -15 20 45'},
    { name: 'wi_logout', path: 'assets/icons/sign-out-alt-solid.svg', viewBox: '0 -15 20 45'},
    { name: 'wi_theme', path: 'assets/icons/wi-theme.svg', viewBox: '0 -15 20 45'},
    /*Social media icons*/
    { name: 'wi_whatsapp', path: 'assets/icons/whatsapp-square-brands.svg'},
    { name: 'wi_youtube', path: 'assets/icons/youtube-square-brands.svg'},
    { name: 'wi_twitter', path: 'assets/icons/twitter-square-brands.svg'},
    { name: 'wi_linkedin', path: 'assets/icons/linkedin-brands.svg'},
  ];
  constructor(
    private authService: AuthService,
    public translateService: TranslateService,
    private modalService: ModalService,
    private translationCustomLoaderService: TranslationCustomLoaderService,
    private utilService: UtilsService
  ) {
    this.authService.languageSubject.subscribe(
      (language) => {
        this.translationCustomLoaderService.getLocalTranslation(`${language['langId']}-${language['langCode']}`);
        this.translateService.use(`${language['langId']}-${language['langCode']}`);
      }
    );
    this.utilService.addIcon(this.iconsList);
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
   this.modalService.registerModals(this.modals);
  }
}
