import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { ICompanyTaxModel } from '@shared/models/companyTax.model';
import { ModalService } from '@core/services/modal/modal.service';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';
import { UserService } from '@core/services/user/user.service';

import { AddTaxCompanyComponent } from '../add-tax-company/add-tax-company.component';

@Component({
  selector: 'wid-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit , OnDestroy {
  ELEMENT_DATA = new BehaviorSubject<ICompanyTaxModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private userService: UserService,
              private modalService: ModalService,
              private companyTaxService: CompanyTaxService) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.modalService.registerModals(
      { modalName: 'addTax', modalComponent: AddTaxCompanyComponent });
    this.isLoading.next(true);
    this.getAllTax();
  }

  /**
   * @description get all tax by company
   */
  getAllTax() {
    const email = this.userService.emailAddress;
    this.subscriptions.push(this.companyTaxService.getCompanyTax(email).subscribe((data) => {
      this.ELEMENT_DATA.next(data);
      this.isLoading.next(false);
    }));
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      /* case ('show'): this.showUser(rowAction.data);
        break; */
       case ('update'): this.updateTax(rowAction.data);
         break;
      /* case('delete'): this.onChangeStatus(rowAction.data);*/
     }
  }

  /**
   * @description : update tax
   * @param data: object to update
   */
  updateTax(data) {
    this.modalService.displayModal('addTax', data,
      '657px', '480px').subscribe((res) => {
        if (res) {
          this.getAllTax();
        }
    });
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
