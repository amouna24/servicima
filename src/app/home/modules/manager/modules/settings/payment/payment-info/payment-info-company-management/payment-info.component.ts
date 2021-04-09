import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ModalService } from '@core/services/modal/modal.service';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';

import { AddPaymentInfoCompanyComponent } from '../add-payment-info-company/add-payment-info-company.component';

@Component({
  selector: 'wid-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit, OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  email: string;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService,
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
    this.getPaymentTerms();
  }

  getPaymentTerms() {
    const cred = this.localStorageService.getItem('userCredentials');
     this.email = cred['email_address'];
    this.subscriptions.push(this.companyPaymentTermsService.getCompanyPaymentTerms(this.email).subscribe((data) => {
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
   * @param status: string
   */
  onChangeStatus(id: string) {
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      status: id['status']
    };

    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '560px', '300px').subscribe((value) => {
      if (value === true) {
        this.subscriptions.push( this.companyPaymentTermsService.paymentTermsCompanyChangeStatus(id['_id'], id['status'], this.email).subscribe(
          (res) => {
            if (res) {
              this.getPaymentTerms();
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
    this.getPaymentTerms();
  });
  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
