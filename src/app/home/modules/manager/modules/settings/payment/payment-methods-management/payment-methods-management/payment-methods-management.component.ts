import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { IRefdataModel } from '@shared/models/refdata.model';
import { ModalService } from '@core/services/modal/modal.service';
import { RefdataService } from '@core/services/refdata/refdata.service';

import { AddPaymentMethodComponent } from '../add-payment-method/add-payment-method.component';

@Component({
  selector: 'wid-payment-methods-management',
  templateUrl: './payment-methods-management.component.html',
  styleUrls: ['./payment-methods-management.component.scss']
})
export class PaymentMethodsManagementComponent implements OnInit {
  refData: { } = { };
  ELEMENT_DATA = new BehaviorSubject<IRefdataModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  applicationId: string;
  email: string;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService,
              private utilsService: UtilsService,
              private modalService: ModalService,
              private refdataService: RefdataService, ) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'addPaymentTermsMethode', modalComponent: AddPaymentMethodComponent });
    this.isLoading.next(true);
   await this.getPaymentMethode();
  }

 async getPaymentMethode() {
    const data = await this.getRefdata();
    this.ELEMENT_DATA.next(data['PAYMENT_MODE']);
    this.isLoading.next(false);
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
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.email = cred['email_address'];
    const list = ['PAYMENT_MODE'];
    this.refData =  await this.refdataService.getRefData( this.utilService.getCompanyId(this.email, this.applicationId) , this.applicationId,
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
        this.subscriptions.push( this.refdataService.refdataChangeStatus(id['_id'], id['status'], this.email).subscribe(
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
    const language = this.localStorageService.getItem('language').langId;
    let listArray = [];
    this.refdataService.getSpecificRefdata(data.RefDataKey.application_id, data.RefDataKey.company_id,
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

    });

  }

}
