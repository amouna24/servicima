import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
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
  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  emailAddress: string;
  companyId: string;
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
              private refdataService: RefdataService, ) { }

  /**
   * @description Loaded when component in init state
   */
   ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'addPaymentTermsMethode', modalComponent: AddPaymentMethodComponent });
    this.isLoading.next(true);
    this.getConnectedUser();
    this.getPaymentMethode(this.nbtItems.getValue(), 0).then(() => this.isLoading.next(false));
  }

 async getPaymentMethode(limit: number, offset: number) {
    const data = await this.getRefdata(limit, offset);
    this.ELEMENT_DATA.next(data);
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
            this.companyId = userInfo['company'][0]._id;
          }
        });
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
       case('delete.user.action'): this.onChangeStatus(rowAction.data);
     }
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefdata(limit: number, offset: number) {
    return  new Promise((resolve => {
      this.refdataService
        .getRefDataByTypeDatatable( this.companyId , this.userService.applicationId, this.utilService.getRefTypeId('PAYMENT_MODE'),
          this.userService.language.langId, limit, offset).subscribe((data) => {
        resolve(data);
      });
    }));
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
 async loadMoreItems(params) {
      this.nbtItems.next(params.limit);
   await   this.getPaymentMethode(params.limit, params.offset);
  }

  /**
   * @description : change the status of the user
   * @param list: string
   */
  onChangeStatus(list) {
    const confirmation = {
      code: 'changeStatus',
      title: 'change.status.title.modal',
      description: 'change.status.description.modal',
      status: 'ACTIVE'
    };

    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation, '560px', '300px').subscribe((value) => {
      if (value === true) {
        list.map((id) => {
          this.subscriptions.push(this.refdataService.refdataChangeStatus(id['_id'], id['status'], this.emailAddress).subscribe(
            async (res) => {
              if (res) {
                await this.getPaymentMethode(this.nbtItems.getValue(), 0);
              }
            },
            (err) => console.error(err),
          ));
        });
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
        '657px', '276px').subscribe(async (res) => {
          if (res) {
            await this.getPaymentMethode(this.nbtItems.getValue(), 0);
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
