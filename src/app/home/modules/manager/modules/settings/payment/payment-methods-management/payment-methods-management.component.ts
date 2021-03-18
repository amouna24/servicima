import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { IRefdataModel } from '@shared/models/refdata.model';

@Component({
  selector: 'wid-payment-methods-management',
  templateUrl: './payment-methods-management.component.html',
  styleUrls: ['./payment-methods-management.component.scss']
})
export class PaymentMethodsManagementComponent implements OnInit {

  ELEMENT_DATA = new BehaviorSubject<IRefdataModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  paymentMethodList: IRefdataModel[] = [];
  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService, ) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.isLoading.next(true);
    const cred = this.localStorageService.getItem('userCredentials');
    const applicationId = cred['application_id'];
    const email = cred['email_address'];
    await forkJoin([
      this.utilService.getPaymentMethode(this.utilService.getCompanyIdd(email), applicationId),
      this.utilService.getPaymentMethodeAll(this.utilService.getCompanyIdd('ALL'), this.utilService.getApplicationID('ALL')),
    ]).toPromise().then(
      (data) => {
        this.paymentMethodList =  data[0].concat(data[1]);
      });
    this.ELEMENT_DATA.next(this.paymentMethodList);
    this.isLoading.next(false);
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
