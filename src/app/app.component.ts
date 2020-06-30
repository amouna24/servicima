import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@widigital-group/auth-npm-front';
import { RoutingStateService } from '@core/services/routingState/routing-state.service';
import { ModalService } from '@core/services/modal/modal.service';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';

import { environment } from '../environments/environment';

@Component({
  selector: 'wid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  modals = [
    { modalName: 'confirmation' , modalComponent : ConfirmationModalComponent },
  ];
  title = 'WIDIGITAL ' + environment.env;

  constructor(
    private authService: AuthService,
    public translateService: TranslateService,
    private  modalService: ModalService,
    private routingState: RoutingStateService,
  ) {
    this.authService.languageSubject.subscribe(
      (language) => {
        this.translateService.use(`${language['langId']}-${language['langCode']}`);
      }
    );
  }
  ngOnInit(): void {
    this.routingState.loadRouting();
   // this.modalService.registerModals(this.modals);
  }
}
