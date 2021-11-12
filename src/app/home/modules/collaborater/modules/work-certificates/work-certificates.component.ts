import { Component, Input, OnInit } from '@angular/core';
import { IUserModel } from '@shared/models/user.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { IUserInfo } from '@shared/models/userInfo.model';
@Component({
  selector: 'wid-work-certificates',
  templateUrl: './work-certificates.component.html',
  styleUrls: ['./work-certificates.component.scss']
})
export class WorkCertificatesComponent implements OnInit {

  applicationId: string;
  emailAddress: string;
  infoUser: IUserInfo;
  user: IUserModel;

  constructor(
    private localStorageService: LocalStorageService,

  ) { }

  ngOnInit(): void {
    const cred = this.localStorageService.getItem('userCredentials');
    console.log('credentials ', cred);
    this.emailAddress = cred['email_address'];
    console.log(this.emailAddress);

  }

}
