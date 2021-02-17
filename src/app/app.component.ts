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
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
   this.modalService.registerModals(this.modals);
   this.utilService.initializeIcons();
  }
}
