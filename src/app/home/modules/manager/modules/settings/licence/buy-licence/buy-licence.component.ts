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
  licence: ILicenceModel;
  constructor(private licenceService: LicenceService,
              private userService: UserService,
              private spinnerService: SpinnerService,
              public paymentService: PaymentService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private utilService: UtilsService) {
  }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit(): Promise<void> {
    await this.getParam();
    await this.userInfo();
    this.saving = this.savingPercentage() > 0 ? this.savingPercentage().toFixed(1) : '';
  }

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
   * @description Change billing pack
   */
  billingChange(event: MatRadioChange): void {
    this.billingPack = event.value;
    this.router.navigate([
      '/manager/settings/licences/buy-licence',
      this.licence.LicenceKey.licence_code,
      event.value
    ]);
  }
  /**
   * @description Calculate total price
   */
  total(billing: string = this.billingPack): string {
    if (billing === 'year') {
      return this.licence.pack_annual_price;
    } else if (billing === 'month') {
      return this.licence.pack_monthly_price;
    } else {
      return '0';
    }
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
      .Buttons(this.paymentService.paypal(this.licence, this.total('year')))
      .render(this.paypalYearElement.nativeElement);
    paypal
      .Buttons(this.paymentService.paypal(this.licence, this.total('month')))
      .render(this.paypalMonthElement.nativeElement);
  }
  /**
   * @description back to previous route
   */
  backClicked() {
    this.utilService.previousRoute();
  }
  confirm() {
    this.router.navigate(
      ['/manager/settings/licences/complete-update'],
    { state: { payment: this.paymentService.paymentMethode , detail: this.paymentService.detail } });
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
