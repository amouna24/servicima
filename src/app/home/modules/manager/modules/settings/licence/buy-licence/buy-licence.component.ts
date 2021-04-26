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
import { UtilsService } from '@core/services/utils/utils.service';
import { ICredentialsModel } from '@shared/models/credentials.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { ICompanyLicenceModel } from '@shared/models/companyLicence.model';
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
  credentials: ICredentialsModel;
  companyLicence: ICompanyLicenceModel;
  usersNbr: number;
  constructor(private licenceService: LicenceService,
              private userService: UserService,
              private spinnerService: SpinnerService,
              public paymentService: PaymentService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private profileService: ProfileService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private utilService: UtilsService) {
  }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit(): Promise<void> {
    await this.getParam();
    this.credentials = this.localStorageService.getItem('userCredentials');
    await this.userInfo().then(
      () => {
        this.companyLicence = this.initCompanyLicence();
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
    this.activatedRoute.paramMap.subscribe(
      params => {
        this.billingPack = params.get('pack');
        this.licence = this.licenceService.getLicenceByCode(params.get('licence'));
      }
    );
    if ((!this.licence) || (this.billingPack !== 'month' && this.billingPack !== 'year') ) {
      await this.router.navigate(['/manager/settings/licences/upgrade-licence']);
    }
  }

  /**
   * @description : get all users
   */
  async getAllUsers() {
    await this.profileService.getAllUser(this.credentials['email_address']).subscribe(
      (data ) => {
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
    this.companyLicence = this.initCompanyLicence();
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
    const month: number = + this.licence.pack_monthly_price * 12;
    const year: number = + this.licence.pack_annual_price;
    return  ((month - year) / month) * 100 ;
  }
  /**
   * @description setup paypal smart button
   */
  paypalInit(): void {
    paypal
      .Buttons(this.paymentService.paypal(this.licence, this.total('year'), this.initCompanyLicence('year')))
      .render(this.paypalYearElement.nativeElement);
    paypal
      .Buttons(this.paymentService.paypal(this.licence, this.total('month'), this.initCompanyLicence('month')))
      .render(this.paypalMonthElement.nativeElement);
  }
  /**
   * @description back to previous route
   */
  backClicked() {
    this.utilService.previousRoute();
  }
  initCompanyLicence(periodicity = this.billingPack): ICompanyLicenceModel {
    // tslint:disable-next-line:prefer-const
    let companyLicence: ICompanyLicenceModel;
    companyLicence.CompanyLicenceKey.application_id = this.credentials.credentialsKey.application_id;
    companyLicence.CompanyLicenceKey.email_adress = this.emailAddress;
    companyLicence.CompanyLicenceKey.licence_code = this.licence.LicenceKey.licence_code;
    companyLicence.CompanyLicenceKey.licence_type = 'STANDARD';
    const startDate = new Date();
    const endDate = periodicity === 'month' ?
      new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDay()) :
      new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDay());
    companyLicence.licence_start_date = startDate.toString();
    companyLicence.licence_end_date = endDate.toString();
    companyLicence.bill_periodicity = periodicity === 'month' ? 'M' : 'Y';
    return companyLicence;
  }
  /**
   * @description confirmation
   */
  confirm() {
    if (this.paymentService.detail.status === 'COMPLETED') {
      this.router.navigate(
        ['/manager/settings/licences/complete-update'],
        { state: {
          payment: this.paymentService.paymentMethode,
            detail: this.paymentService.detail
        }
        });
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
