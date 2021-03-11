import { Component, OnInit } from '@angular/core';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';
import { ITaxModel } from '@shared/models/tax.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wid-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  ELEMENT_DATA = new BehaviorSubject<ITaxModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  constructor(private companyTaxService: CompanyTaxService) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.isLoading.next(true);
    this.companyTaxService.getTax().subscribe((data) => {
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
