import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ModalService } from '@core/services/modal/modal.service';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';
import { UserService } from '@core/services/user/user.service';

import { UtilsService } from '@core/services/utils/utils.service';

import { AddPaymentInfoCompanyComponent } from '../add-payment-info-company/add-payment-info-company.component';

@Component({
  selector: 'wid-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit, OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  emailAddress: string;
  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private userService: UserService,
              private modalService: ModalService,
              private companyPaymentTermsService: CompanyPaymentTermsService, ) {
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.modalService.registerModals(
      { modalName: 'addPaymentTerms', modalComponent: AddPaymentInfoCompanyComponent });
    this.isLoading.next(true);
    this.getConnectedUser();
    this.getPaymentTerms(this.nbtItems.getValue(), 0);
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

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
      this.nbtItems.next(params.limit);
      this.getPaymentTerms(params.limit, params.offset);
  }

  getPaymentTerms(limit: number, offset: number ) {
    this.subscriptions.push(this.companyPaymentTermsService.getCompanyPaymentTerms(this.emailAddress, 'ACTIVE', offset, limit).subscribe((data) => {
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
       /*  case ('show'): this.showUser(rowAction.data);
           break; */
       case ('update'): this.updatePaymentTerms(rowAction.data);
         break;
       case('delete'): this.onChangeStatus(rowAction.data);
 }
}
  /**
   * @description : change the status
   * @param id: string
   */
  onChangeStatus(id: string) {
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      status: id['status']
    };

    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '560px', '300px').subscribe((value) => {
      if (value === true) {
        this.subscriptions.push( this.companyPaymentTermsService
          .paymentTermsCompanyChangeStatus(id['_id'], id['status'], this.emailAddress).subscribe(
          (res) => {
            if (res) {
              this.getPaymentTerms(this.nbtItems.getValue(), 0);
            }
          },
          (err) => console.error(err),
        ));
        this.subscriptionModal.unsubscribe();
      }
    });
  }
  updatePaymentTerms(data) {
  this.modalService.displayModal('addPaymentTerms', data,
    '657px', '396px').subscribe(() => {
    this.getPaymentTerms(this.nbtItems.getValue(), 0);
  });
  }

  getDataWithStatus(status) {
    this.isLoading.next(true);
    this.subscriptions.push(this.companyPaymentTermsService
      .getCompanyPaymentTerms(this.emailAddress, status, this.nbtItems.getValue(), 0).subscribe((data) => {
      this.ELEMENT_DATA.next(data);
      this.isLoading.next(false);
    }));
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
