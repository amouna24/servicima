import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ModalService } from '@core/services/modal/modal.service';

import { AddPaymentInfoCompanyComponent } from '../add-payment-info-company/add-payment-info-company.component';

@Component({
  selector: 'wid-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);

  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService,
              private modalService: ModalService, ) {
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.modalService.registerModals(
      { modalName: 'addPaymentTerms', modalComponent: AddPaymentInfoCompanyComponent });
    const cred = this.localStorageService.getItem('userCredentials');
    const email = cred['email_address'];
    this.isLoading.next(true);
    this.utilService.getCompanyPaymentTerms(email).subscribe((data) => {
      this.ELEMENT_DATA.next(data);
      this.isLoading.next(false);
    });
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
      /*   case('delete'): this.onChangeStatus(rowAction.data);*/
 }
}
  updatePaymentTerms(data) {
  this.modalService.displayModal('addPaymentTerms', data,
    '657px', '396px');
  }
}
