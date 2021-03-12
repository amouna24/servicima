import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ILicenceModel } from '@shared/models/licence.model';
import { LicenceService } from '@core/services/licence/licence.service';

@Component({
  selector: 'wid-buy-licence',
  templateUrl: './buy-licence.component.html',
  styleUrls: ['./buy-licence.component.scss'],
})
export class BuyLicenceComponent implements OnInit {
  paiementMethode: boolean[] = [false, false, false];
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
              private route: ActivatedRoute) {
  }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit(): Promise<void> {
    await this.getParam();
    await this.userInfo();
    this.saving = this.savingPercentage() > 0 ? this.savingPercentage().toFixed(1) : '';
  }

  /**
   * @description Get query params
   */
  async getParam(): Promise<void> {
    this.route.queryParams.subscribe(
      params => {
        this.billingPack = params['pack'];
        this.licence = this.licenceService.getLicenceByCode(params['licence']);
      }
    );
    console.log(this.licence);
    console.log(new Date().toLocaleString());
    console.log(new Date(this.licence.licence_start_date).toLocaleString());
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
   * @description Calculate total price
   */
  total(): string {
    if (this.billingPack === 'year') {
      return this.licence.pack_annual_price;
    } else if (this.billingPack === 'month') {
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
}
