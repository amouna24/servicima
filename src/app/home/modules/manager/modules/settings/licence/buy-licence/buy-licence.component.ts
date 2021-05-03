import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ILicenceModel } from '@shared/models/licence.model';
import { LicenceService } from '@core/services/licence/licence.service';
import { PaymentService } from '@core/services/payment/payment.service';
import { MatRadioChange } from '@angular/material/radio';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@widigital-group/auth-npm-front';
import { Subject } from 'rxjs';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ProfileService } from '@core/services/profile/profile.service';

declare var paypal;

@Component({
  selector: 'wid-buy-licence',
  templateUrl: './buy-licence.component.html',
  styleUrls: ['./buy-licence.component.scss'],
})
export class BuyLicenceComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('paypalyear', { static: true}) paypalYearElement: ElementRef;
  @ViewChild('paypalmonth', { static: true}) paypalMonthElement: ElementRef;
  destroy$: Subject<boolean> = new Subject<boolean>();
  paiementMethode: any[] = [
    {
      name: 'credit card',
      checked: false
    },
    {
      name: 'paypal',
      checked: false
    },
    {
      name: 'sepa',
      checked: false
    }
  ];
  name: string;
  emailAddress: string;
  avatar: any;
  haveImage: any;
  billingPack: string;
  saving: string;
  extraUser: number;
  licence: ILicenceModel;
  credentials: any;
  companyLicence: any;
  usersNbr: number;
  companyLicenceList: any[];

  constructor(private licenceService: LicenceService,
              private userService: UserService,
              private spinnerService: SpinnerService,
              public paymentService: PaymentService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private profileService: ProfileService,
              private router: Router,
              private localStorageService: LocalStorageService) {
  }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit(): Promise<void> {
    await this.getParam();
    this.credentials = this.localStorageService.getItem('userCredentials');
    await this.userInfo().then(
      () => {
        this.initCompanyLicence();
        console.log(this.companyLicenceList);
      }
    );
    await this.getAllUsers();
    this.saving = this.savingPercentage() > 0 ? this.savingPercentage().toFixed(1) : '';
  }

  /**
   * @description Loaded after component complete init state
   */
  ngAfterViewInit(): void {
    this.paypalInit();
  }

  /**
   * @description Get query params
   */
  async getParam(): Promise<void> {
    this.billingPack = this.activatedRoute.snapshot.paramMap.get('pack');
    await this.licenceService.getLicenceByCode(this.activatedRoute.snapshot.paramMap.get('licence'))
      .subscribe((data) => this.licence = data[0]);
  }

  /**
   * @description : get all users
   */
  async getAllUsers() {
    await this.profileService.getAllUser(this.emailAddress).subscribe(
      (data) => {
        this.usersNbr = data.length;
        this.extraUser = data.length - this.licence.free_user_nbr;
        this.extraUser = this.extraUser > 0 ? this.extraUser : 0;
      }
    );
  }

  /**
   * @description Load User Info
   */
  async userInfo(): Promise<void> {
    this.userService.connectedUser$.subscribe((userInfo) => {
      if (userInfo) {
        this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
        this.name = `${userInfo['user'][0]['first_name']}  ${userInfo['user'][0]['last_name']}`;
        this.haveImage = userInfo['user'][0]['photo'];
        this.companyLicenceList = userInfo['companylicence'];
      }
    });
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
  }

  /**
   * @description Change billing pack
   */
  billingChange(event: MatRadioChange): void {
    this.billingPack = event.value;
    this.initCompanyLicence();
    this.router.navigate([
      '/manager/settings/licences/buy-licence',
      this.licence.LicenceKey.licence_code,
      event.value
    ]);
  }

  /**
   * @description Calculate total price
   */
  total(billing: string = this.billingPack): number {
    let total = 0;
    if (billing === 'year') {
      total = this.licence.pack_annual_price + (this.extraUser * this.licence.annual_extra_user_price);
    } else if (billing === 'month') {
      total = this.licence.pack_monthly_price + (this.extraUser * this.licence.monthly_extra_user_price);
    }
    return total;
  }

  /**
   * @description calculate saving percentage
   * @return saving percentage
   */
  savingPercentage(): number {
    const month: number = +this.licence.pack_monthly_price * 12;
    const year: number = +this.licence.pack_annual_price;
    return ((month - year) / month) * 100;
  }

  /**
   * @description setup paypal smart button
   */
  paypalInit(): void {
    this.initCompanyLicence('year').then(
      () => {
        paypal
          .Buttons(this.paymentService.paypal(this.licence, this.total('year')))
          .render(this.paypalYearElement.nativeElement);
      }
    );
    this.initCompanyLicence('month').then(
      () => {
        paypal
          .Buttons(this.paymentService.paypal(this.licence, this.total('month')))
          .render(this.paypalMonthElement.nativeElement);
      }
    );
  }

  async initCompanyLicence(periodicity: string = this.billingPack): Promise<void> {
    const startDate = new Date();
    const endDate = periodicity === 'month' ?
      new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDay()) :
      new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDay());
    this.companyLicence = {
      application_id: this.userService.applicationId,
      email_address: this.emailAddress,
      licence_code: this.licence.LicenceKey.licence_code,
      licence_type: 'STANDARD',
      licence_start_date: startDate.toString(),
      licence_end_date: endDate.toString(),
      bill_periodicity: periodicity === 'month' ? 'M' : 'Y'
    };
  }

  /**
   * @description confirmation
   */
  confirm() {
    if (true) {
      this.disableAllCompanyLicence().then(
        () => {
          this.addCompanyLicence().then(
            () => {
              // this.router.navigate(
              //   ['/manager/settings/licences/complete-update'],
              //   {
              //     state: {
              //       payment: this.paymentService.paymentMethode,
              //       detail: this.paymentService.detail
              //     }
              //   });
            }
          );
        }
      );
    }
  }

  async addCompanyLicence(): Promise<void> {
    await this.licenceService.addCompanyLicence(this.companyLicence).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  async disableAllCompanyLicence(): Promise<void> {
    for (const val of this.companyLicenceList) {
      if (val.status === 'ACTIVE') {
        await this.licenceService.disableCompanyLicence(val._id)
          .subscribe(
            res => console.log(res)
          );
      }
    }
  }

  /**
   * @description logout: remove fingerprint and local storage
   */
  logout(): void {
    this.authService.logout().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
        this.userService.connectedUser$.next(null);
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('currentToken');
        this.router.navigate(['/auth/login']);
      },
      (err) => {
        console.error(err);
      });
  }

  /**
   * @description Destroy All subscriptions declared with takeUntil operator
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
