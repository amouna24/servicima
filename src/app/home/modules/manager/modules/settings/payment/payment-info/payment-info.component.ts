import { Component, OnInit } from '@angular/core';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';

@Component({
  selector: 'wid-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {
  ELEMENT_DATA = [];
  loaded: Promise<boolean>;
  constructor(private companyPaymentTermsService: CompanyPaymentTermsService) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.companyPaymentTermsService.getPaymentTerms().subscribe((data) => {
      this.ELEMENT_DATA = data;
      console.log(this.ELEMENT_DATA);
      // to review
     this.ELEMENT_DATA.forEach((payment) => {
       payment['payment_terms_code'] = payment['paymentTermsKey'].payment_terms_code;
      });
      this.loaded = Promise.resolve(true);
    });
  }

}
