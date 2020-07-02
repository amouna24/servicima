import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@widigital-group/auth-npm-front';

import { environment } from '../environments/environment';

@Component({
  selector: 'wid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WIDIGITAL ' + environment.env;

  constructor(
    private authService: AuthService,
    public translateService: TranslateService
  ) {
    this.authService.languageSubject.subscribe(
      (language) => {
        this.translateService.use(`${language['langId']}-${language['langCode']}`);
      }
    );
  }
}
