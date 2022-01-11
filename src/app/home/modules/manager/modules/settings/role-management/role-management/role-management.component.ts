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
  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  refData: { } = { };
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
              private modalService: ModalService,
              private userService: UserService,
              private refDataService: RefdataService) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'addRole', modalComponent: AddRoleComponent });
    this.isLoading.next(true);
    this.getConnectedUser();
    await  this.getRole(this.nbtItems.getValue(), 0);

    this.isLoading.next(false);
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
   async  loadMoreItems(params) {
      this.nbtItems.next(params.limit);
    await this.getRole(params.limit, params.offset);
  }

  /**
   * @description : get role
   */
 async getRole(limit: number, offset: number) {
    this.refData =   await this.getRefdata(limit, offset);
    this.ELEMENT_DATA.next(this.refData);
  }
  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
  switch (rowAction.actionType) {
       case ('update'): this.updateRole(rowAction.data);
         break;
       case('delete.user.action'): this.onChangeStatus(rowAction.data);
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
            this.companyId = userInfo['company'][0]._id;
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
      '657px', '565px').subscribe(async (res) => {
        if (res) {
       await this.getRole(this.nbtItems.getValue(), 0);
        }
    });
    }, error => console.error(error)));
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefdata(limit: number, offset: number) {
   return  new Promise((resolve => {
      this.refDataService
        .getRefDataByTypeDatatable( this.companyId , this.userService.applicationId, this.utilService.getRefTypeId('ROLE'),
          this.userService.language.langId, limit, offset).subscribe((data) => {
        resolve(data);
      });
    }));
  }

  /**
   * @description : change the status
   * @param id: string
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
          this.subscriptions.push(this.refDataService.refdataChangeStatus(id['_id'], id['status'], this.emailAddress).subscribe(
            async (res) => {
              if (res) {
                await this.getRole(this.nbtItems.getValue(), 0);
              }
            },
            (err) => console.error(err),
          ));
        });
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
