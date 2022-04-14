import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-list-request-manager',
  templateUrl: './list-request-manager.component.html',
  styleUrls: ['./list-request-manager.component.scss']
})
export class ListRequestManagerComponent implements OnInit {

  companyEmail: string;
  applicationId: string;
  constructor(
      private localStorageService: LocalStorageService,

  ) {
  }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
  }
  /**
   * @description get connected user from local storage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.companyEmail = cred['email_address'];
    this.applicationId = cred['application_id'];
  }

}
