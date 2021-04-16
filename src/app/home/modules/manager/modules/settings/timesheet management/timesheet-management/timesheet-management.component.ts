import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ModalService } from '@core/services/modal/modal.service';
import { TimesheetSettingService } from '@core/services/timesheet-setting/timesheet-setting.service';

import { AddPaymentInfoCompanyComponent } from '../../payment/payment-info/add-payment-info-company/add-payment-info-company.component';

@Component({
  selector: 'wid-timesheet-management',
  templateUrl: './timesheet-management.component.html',
  styleUrls: ['./timesheet-management.component.scss']
})
export class TimesheetManagementComponent implements OnInit , OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  email: string;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService,
              private modalService: ModalService,
              private timesheetSettingService: TimesheetSettingService, ) {
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.modalService.registerModals(
      { modalName: 'addPaymentTerms', modalComponent: AddPaymentInfoCompanyComponent });
    this.isLoading.next(true);
    this.getTimesheetSetting();
  }

  /**
   * @description get timesheet setting by company
   */
  getTimesheetSetting(): void {
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred['email_address'];
    this.subscriptions.push(this.timesheetSettingService.getCompanyTimesheetSetting(this.email).subscribe((data) => {
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
    /*  case ('update'): this.updatePaymentTerms(rowAction.data);
        break;
      case('delete'): this.onChangeStatus(rowAction.data);*/
    }
  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
