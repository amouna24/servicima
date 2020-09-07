import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { UserService } from '@core/services/user/user.service';
import { headerMenu } from '@shared/statics/header-menu.static';
import { IHeaderMenu } from '@shared/models/header-menu/header-menu.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ICompanyLicenceModel } from '@shared/models/companyLicence.model';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '@core/services/utils/utils.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ModalService } from '@core/services/modal/modal.service';

import { LicenceExpirationComponent } from '../../../home/modules/manager/modules/settings/licence/licence-expiration/licence-expiration.component';

@Component({
  selector: 'wid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  name: string;
  headerMenu: IHeaderMenu[] = headerMenu;
  companyLicenceList: ICompanyLicenceModel[];
  licenceType: string;
  licenceCode: string;
  endLicence: number;
  emailAddress: string;
  /** subscription */
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private utilService: UtilsService,
              public dialog: MatDialog,
              private modalsServices: ModalService,
  ) {
    this.utilService.addIcon([{ 'name': 'buy', 'path': 'assets/icons/bag.svg'},
      ]
    );
  }

  /**
   * @description Loaded when component in init state
   */
 ngOnInit(): void {
    this.modalsServices.registerModals([
      { modalName: 'expirationLicense', modalComponent: LicenceExpirationComponent}]);
    this.userService.connectedUser$.pipe(takeUntil(this.destroy$)).subscribe((userInfo) => {
      if (userInfo) {
        this.getData(userInfo);
        // open dialog expiration licence when trial licence expire
        if (this.endLicence <= 0 && this.licenceType === 'TRIAL') {
          this.modalsServices.displayModal('expirationLicense', null , '40%')
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe(
              (resp) => {
              },
              (error) => {
                console.error(error);
              });
        }
      }
    });
  }

  /**
   * @description get data
   * @param userInfo user info
   */
  getData(userInfo: IUserInfo) {
    this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
    this.name = `${userInfo['user'][0]['first_name']}  ${userInfo['user'][0]['last_name']}`;
    this.companyLicenceList = userInfo['companylicence'][0];
    this.licenceType = this.companyLicenceList['companyLicenceKey']['licence_type'];
    this.licenceCode = this.companyLicenceList['companyLicenceKey']['licence_code'];
    this.endLicence = this.utilService.differenceDay(this.companyLicenceList['licence_end_date'], Date.now());
  }

  /**
   * @description logout: remove fingerprint and local storage
   * navigate from login
   */
  logout(): void {
    this.authService.logout().subscribe(() => {
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('currentToken');
        this.userService.connectedUser$.next(null);
        this.router.navigate(['/auth/login']);
      },
      (err) => {
        console.error(err);
      });
  }

  /**
   * @description  : Open dialog expiration licence
   */
  expirationLicence(): void {
    this.router.navigate(['/manager/settings/licence/buy-licence']);
  }

  /**
   * @description  : Open dialog upgrade licence
   */
  UpgradeLicence() {
    this.router.navigate(['/manager/settings/licence/upgrade-licence']);
  }

  /**
   * @description destroy subscriptions
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
