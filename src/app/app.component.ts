import { Component } from '@angular/core';

import { environment } from '../environments/environment';

@Component({
  selector: 'wid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WIDIGITAL ' + environment.env;

  constructor() { }
}
