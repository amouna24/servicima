import { Component, OnInit } from '@angular/core';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';
import { BehaviorSubject } from 'rxjs';
import { IPaymentTermsModel } from '@shared/models/paymentTerms.model';

@Component({
  selector: 'wid-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {
  ELEMENT_DATA = new BehaviorSubject<IPaymentTermsModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  constructor(private companyPaymentTermsService: CompanyPaymentTermsService) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.isLoading.next(true);
    this.companyPaymentTermsService.getPaymentTerms().subscribe((data) => {
      this.ELEMENT_DATA.next(data);
      this.isLoading.next(false);
    });
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    /* switch (rowAction.actionType) {
       case ('show'): this.showUser(rowAction.data);
         break;
       case ('update'): this.updateUser(rowAction.data);
         break;
       case('delete'): this.onChangeStatus(rowAction.data);
     }*/
  }
}
