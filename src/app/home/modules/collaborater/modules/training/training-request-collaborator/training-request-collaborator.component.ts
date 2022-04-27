import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-training-request-collaborator',
  templateUrl: './training-request-collaborator.component.html',
  styleUrls: ['./training-request-collaborator.component.scss']
})
export class TrainingRequestCollaboratorComponent implements OnInit {

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
