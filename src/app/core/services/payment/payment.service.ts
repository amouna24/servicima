import { Injectable } from '@angular/core';
import { ILicenceModel } from '@shared/models/licence.model';
import { UtilsService } from '@core/services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  paidFor = false;
  error = false;

  constructor(
    private utilsService: UtilsService
  ) {
  }

  paypal(licence: ILicenceModel, total): any {
    // tslint:disable-next-line:prefer-const
    let purshases: any[];
    return {
      style: {
        layout: 'horizontal',
        color: 'gold',
        shape: 'pill',
        label: 'pay',
        height: 35,
        tagline: false
      },
      onApprove: async (data, actions) => {
        return await actions.order.capture().then(
          (details) => {
            this.utilsService.openSnackBar('Transaction completed by ' + details.payer.name.given_name, null, 3000);
            this.paidFor = true;
          }
        );

      },
      onClick: (data, actions) => {
        purshases = [
          {
            description: licence.licence_desc,
            amount: {
              currency_code: 'EUR',
              value: total
            }
          }
        ];
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units:  purshases
        });
      },
      onError: err => {
        this.error = true;
        console.log(err);
      }
    };
  }

}
