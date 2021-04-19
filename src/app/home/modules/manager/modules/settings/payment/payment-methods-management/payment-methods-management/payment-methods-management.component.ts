import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { IRefdataModel } from '@shared/models/refdata.model';
import { ModalService } from '@core/services/modal/modal.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UserService } from '@core/services/user/user.service';

import { AddPaymentMethodComponent } from '../add-payment-method/add-payment-method.component';

@Component({
  selector: 'wid-payment-methods-management',
  templateUrl: './payment-methods-management.component.html',
  styleUrls: ['./payment-methods-management.component.scss']
})
export class PaymentMethodsManagementComponent implements OnInit, OnDestroy {
  refData: { } = { };
  ELEMENT_DATA = new BehaviorSubject<IRefdataModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private userService: UserService,
              private modalService: ModalService,
              private refdataService: RefdataService, ) { }

  /**
   * @description Loaded when component in init state
   */
   ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'addPaymentTermsMethode', modalComponent: AddPaymentMethodComponent });
    this.isLoading.next(true);
    this.getPaymentMethode().then(() => this.isLoading.next(false));
  }

 async getPaymentMethode() {
    const data = await this.getRefdata();
    this.ELEMENT_DATA.next(data['PAYMENT_MODE']);
  }
  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
     switch (rowAction.actionType) {
       /* case ('show'): this.showUser(rowAction.data);
         break;*/
       case ('update'): this.updatePaymentMethod(rowAction.data);
         break;
       case('delete'): this.onChangeStatus(rowAction.data);
     }
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefdata() {
    const list = ['PAYMENT_MODE'];
    this.refData =  await this.refdataService
      .getRefData( this.utilService.getCompanyId(this.userService.emailAddress, this.userService.applicationId) , this.userService.applicationId,
      list, true);
    return this.refData;
  }
  /**
   * @description : change the status of the user
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
        this.subscriptions.push( this.refdataService.refdataChangeStatus(id['_id'], id['status'], this.userService.emailAddress).subscribe(
          async (res) => {
            if (res) {
             await this.getPaymentMethode();
            }
          },
          (err) => console.error(err),
        ));
        this.subscriptionModal.unsubscribe();
      }
    });
  }
  updatePaymentMethod(data) {
    const language = this.userService.language.langId;
    let listArray = [];
    this.subscriptions.push(this.refdataService.getSpecificRefdata(data.RefDataKey.application_id, data.RefDataKey.company_id,
      data.RefDataKey.ref_data_code, data.RefDataKey.ref_type_id).subscribe((allList) => {
      listArray = allList;
      listArray = listArray.filter((list) => {
        if (list.RefDataKey.language_id !== language) {
          return list;
        }
      });
      const obj = { data, list: listArray};
      this.modalService.displayModal('addPaymentTermsMethode', obj,
        '657px', '270px').subscribe(async (res) => {
          if (res) {
            await this.getPaymentMethode();
          }
      });

    }));

  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
