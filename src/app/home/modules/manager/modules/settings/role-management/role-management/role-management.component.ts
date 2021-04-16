import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { IRefdataModel } from '@shared/models/refdata.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ModalService } from '@core/services/modal/modal.service';
import { RefdataService } from '@core/services/refdata/refdata.service';

import { AddRoleComponent } from '../add-role/add-role.component';

@Component({
  selector: 'wid-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  ELEMENT_DATA = new BehaviorSubject<IRefdataModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  refData: { } = { };
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  applicationId: string;
  email: string;
  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService,
              private modalService: ModalService,
              private utilsService: UtilsService,
              private refdataService: RefdataService) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.email = cred['email_address'];
    this.modalService.registerModals(
      { modalName: 'add', modalComponent: AddRoleComponent });
    this.isLoading.next(true);
   await this.getRole();
  }

 async getRole() {
    const data = await this.getRefdata();
    this.ELEMENT_DATA.next(data['ROLE']);
    this.isLoading.next(false);
  }
  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
  switch (rowAction.actionType) {
    /*   case ('show'): this.showUser(rowAction.data);
         break;*/
       case ('update'): this.updateRole(rowAction.data);
         break;
       case('delete'): this.onChangeStatus(rowAction.data);
     }
  }
  updateRole(data) {
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
    this.modalService.displayModal('add', obj,
      '657px', '520px').subscribe(async (res) => {
        if (res) {
       await this.getRole();
        }
    });
    });
  }
  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefdata() {
    const list = ['ROLE'];
    this.refData =  await this.refdataService.getRefData( this.utilService.getCompanyId(this.email, this.applicationId) , this.applicationId,
      list, true);
    return this.refData;
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
        this.subscriptions.push( this.refdataService.refdataChangeStatus(id['_id'], id['status'], this.email).subscribe(
          async (res) => {
            if (res) {
              await this.getRole();
            }
          },
          (err) => console.error(err),
        ));
        this.subscriptionModal.unsubscribe();
      }
    });
  }
}
