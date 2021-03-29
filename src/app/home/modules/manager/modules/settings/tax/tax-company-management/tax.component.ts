import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ICompanyTaxModel } from '@shared/models/companyTax.model';
import { ModalService } from '@core/services/modal/modal.service';

import { AddTaxCompanyComponent } from '../add-tax-company/add-tax-company.component';

@Component({
  selector: 'wid-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  ELEMENT_DATA = new BehaviorSubject<ICompanyTaxModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService,
              private modalService: ModalService, ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.modalService.registerModals(
      { modalName: 'addTax', modalComponent: AddTaxCompanyComponent });
    const cred = this.localStorageService.getItem('userCredentials');
    const email = cred['email_address'];
    this.isLoading.next(true);
    this.utilService.getCompanyTax(email).subscribe((data) => {
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
      /* case ('show'): this.showUser(rowAction.data);
        break; */
       case ('update'): this.updateTax(rowAction.data);
         break;
      /* case('delete'): this.onChangeStatus(rowAction.data);*/
     }
  }

  updateTax(data) {
    this.modalService.displayModal('addTax', data,
      '657px', '480px');
  }
}
