import { Injectable } from '@angular/core';
import { ILicenceModel } from '@shared/models/licence.model';
import { UtilsService } from '@core/services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  paidFor = false;
  error = false;
  detail: any;
  paymentMethode: string;
  constructor(
    private utilsService: UtilsService,
  ) {
  }

  paypal(licence: ILicenceModel, total): any {
    return {
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              reference_id: licence.LicenceKey.licence_code,
              description: licence.licence_desc,
              amount: {
                currency_code: licence.price_currency_id,
                value: total
              }
            }
          ]
        });
      },
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
           if (details.status === 'COMPLETED') {
             this.detail = {
               status: details.status,
               licence: licence.LicenceKey.licence_code ,
               total,
               create_time: details.create_time,
             };
             this.paidFor = true;
             this.paymentMethode = 'Paypal';
             this.utilsService.openSnackBar('Transaction completed by ' + details.payer.name.given_name, null, 3000);
           }
          }
        );

      },
      onError: err => {
        this.error = true;
        console.log(err);
      }
    };
  }

}
