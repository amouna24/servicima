import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { IRefdataModel } from '@shared/models/refdata.model';
import { ModalService } from '@core/services/modal/modal.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UserService } from '@core/services/user/user.service';

import { AddRoleComponent } from '../add-role/add-role.component';

@Component({
  selector: 'wid-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit, OnDestroy {
  ELEMENT_DATA = new BehaviorSubject<IRefdataModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  refData: { } = { };
  emailAddress: string;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private modalService: ModalService,
              private userService: UserService,
              private refDataService: RefdataService) { }

  /**
   * @description Loaded when component in init state
   */
   ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'addRole', modalComponent: AddRoleComponent });
    this.isLoading.next(true);
    this.getConnectedUser();
    this.getRole().then((data) => {
      if (data) {
        this.ELEMENT_DATA.next(data['ROLE']);
        this.isLoading.next(false);
      }
    });
  }

  /**
   * @description : get role
   */
 async getRole() {
    return  await this.getRefdata();
  }
  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
  switch (rowAction.actionType) {
       case ('update'): this.updateRole(rowAction.data);
         break;
       case('delete'): this.onChangeStatus(rowAction.data);
     }
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
  /**
   * @description : update role
   * @param data: object to update
   */
  updateRole(data) {
    const language = this.userService.language.langId;
    let listArray = [];
    this.subscriptions.push(this.refDataService.getSpecificRefdata(data.RefDataKey.application_id, data.RefDataKey.company_id,
      data.RefDataKey.ref_data_code, data.RefDataKey.ref_type_id).subscribe((allList) => {
      listArray = allList.filter((list) => {
        if (list.RefDataKey.language_id !== language) {
          return list;
        }
      });
      const obj = { data, list: listArray};
    this.modalService.displayModal('addRole', obj,
      '657px', '527px').subscribe(async (res) => {
        if (res) {
       await this.getRole();
        }
    });
    }, error => console.error(error)));
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefdata() {
    const list = ['ROLE'];
    this.refData =  await this.refDataService
      .getRefData( this.utilService.getCompanyId(this.emailAddress, this.userService.applicationId) , this.userService.applicationId,
      list, true);
    return this.refData;
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
        this.subscriptions.push(this.refDataService.refdataChangeStatus(id['_id'], id['status'], this.emailAddress).subscribe(
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

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
