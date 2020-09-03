import { Component, OnInit } from '@angular/core';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';
import { ITaxModel } from '@shared/models/tax.model';

@Component({
  selector: 'wid-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  ELEMENT_DATA: ITaxModel[] = [];
  loaded: Promise<boolean>;
  constructor(private companyTaxService: CompanyTaxService) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.companyTaxService.getTax().subscribe((data) => {
      this.ELEMENT_DATA = data;
      // to review
      this.ELEMENT_DATA.forEach((tax) => {
        tax['tax_code'] = tax['taxKey'].tax_code;
        tax['tax_start_date'] = tax['taxKey'].tax_start_date;
      });
      this.loaded = Promise.resolve(true);
    });
  }
}
