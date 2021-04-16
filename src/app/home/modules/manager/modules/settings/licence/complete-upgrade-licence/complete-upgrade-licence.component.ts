import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IUserModel } from '@shared/models/user.model';
import { ICompanyModel } from '@shared/models/company.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-complete-upgrade-licence',
  templateUrl: './complete-upgrade-licence.component.html',
  styleUrls: ['./complete-upgrade-licence.component.scss']
})
export class CompleteUpgradeLicenceComponent implements OnInit, OnDestroy {
  user: IUserModel;
  company: ICompanyModel;
  name: string;
  address: string;
  email: string;
  /** subscription */
  destroy$: Subject<boolean> = new Subject<boolean>();
  detail: { [p: string]: any };
  constructor(private userService: UserService,
              private utilService: UtilsService,
              private router: Router) {
    this.detail = this.router.getCurrentNavigation().extras.state;
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    console.log(this.detail);
    this.userService.connectedUser$.pipe(takeUntil(this.destroy$)).subscribe((userInfo) => {
      if (userInfo) {
        this.user = userInfo['user'][0];
        this.company = userInfo['company'][0];
        this.name = `${this.user['first_name']} ${this.user['last_name']}`;
        this.email = this.company['companyKey']['email_address'];
        this.address = this.company['adress'];
      }
    }, (err) => {
      console.error(err);
    });
  }
  /**
   * @description back to previous route
   */
  backClicked() {
    this.utilService.previousRoute();
  }

  /**
   * @description destroy subscriptions
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
