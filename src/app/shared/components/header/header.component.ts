import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { UserService } from '@core/services/user/user.service';

import { ICompanyLicenceModel } from '@shared/models/companyLicence.model';
import { IUserModel } from '@shared/models/user.model';
import { IUserInfo } from '@shared/models/userInfo.model';

import { LicenceExpirationComponent } from '../../../home/modules/manager/modules/settings/licence/licence-expiration/licence-expiration.component';

@Component({
  selector: 'wid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
  name: string;
  companyLicenceList: ICompanyLicenceModel[];
  licenceType: string;
  licenceCode: string;
  endLicence: number;
  haveImage: any;
  emailAddress: string;
  /** subscription */
  destroy$: Subject<boolean> = new Subject<boolean>();
  avatar: any;
  user: IUserModel;
  constructor(
              private router: Router,
              private userService: UserService,
              private utilService: UtilsService,
              private modalsServices: ModalService,
              private sidenavService: SidenavService,
              private spinnerService: SpinnerService,
  ) { }

  /**
   * @description Loaded when component in init state
   */
 ngOnInit(): void {
    this.modalsServices.registerModals(
      { modalName: 'expirationLicence', modalComponent: LicenceExpirationComponent });
    this.userService.avatar$.subscribe(
      avatar => {
        if (!!avatar) {
          this.avatar = avatar;
          this.spinnerService.isLoadingSubject.next(false);
        } else {
          this.spinnerService.isLoadingSubject.next(true);
        }
      }
    );
    this.userService.connectedUser$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        (userInfo) => {
      if (userInfo) {
        this.getData(userInfo);
        // open dialog expiration licence when trial licence expire
/*       if (this.endLicence <= 0 && this.licenceType === 'TRIAL') {
         this.modalsServices.displayModal('expirationLicence', null, '570px', '480px');
        }*/
      }
    });
  }

  /**
   * @description get data
   * @param userInfo user info
   */
  getData(userInfo: IUserInfo) {
    this.user = userInfo['user'][0];
    this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
    this.name = `${userInfo['user'][0]['first_name']}  ${userInfo['user'][0]['last_name']}`;
    this.companyLicenceList = userInfo['companylicence'][0];
    this.haveImage = userInfo['user'][0]['photo'];
    if (!this.haveImage) {
      this.userService.haveImage$.subscribe((res) => {
        this.haveImage = res;
      });
    }
    this.licenceType = this.companyLicenceList['companyLicenceKey']['licence_type'];
    this.licenceCode = this.companyLicenceList['companyLicenceKey']['licence_code'];
    this.endLicence = this.utilService.differenceDay(this.companyLicenceList['licence_end_date'], Date.now());
  }

  /**
   * @description  : Open dialog expiration licence
   */
  expirationLicence(): void {
   this.router.navigate(['/manager/settings/licences/buy-licence']);
  }

  /**
   * @description  : Open dialog upgrade licence
   */
  UpgradeLicence() {
    this.router.navigate(['/manager/settings/licences/upgrade-licence']);
  }

  /**
   * @description  : Open right sidenav
   */
  toggleSideNav() {
    this.sidenavService.toggleRightSideNav(true);
  }
  /**
   * @description destroy subscriptions
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
