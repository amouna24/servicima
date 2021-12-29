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
  emailAddress: string;
  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);
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
    this.getConnectedUser();
    this.getAllTax(this.nbtItems.getValue(), 0);
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
      this.nbtItems.next(params.limit);
      this.getAllTax(params.limit, params.offset);
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  /**
   * @description get all tax by company
   */
  getAllTax(limit: number, offset: number) {
    this.subscriptions.push(this.companyTaxService.getCompanyTax(this.emailAddress, limit, offset).subscribe((data) => {
      this.ELEMENT_DATA.next(data);
      this.isLoading.next(false);
    }, error => console.error(error)));
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
          this.getAllTax(this.nbtItems.getValue(), 0);
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
