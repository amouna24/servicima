import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { IRefdataModel } from '@shared/models/refdata.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ModalService } from '@core/services/modal/modal.service';

import { AddRoleComponent } from '../add-role/add-role.component';

@Component({
  selector: 'wid-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roleManagementList: IRefdataModel[] = [];
  ELEMENT_DATA = new BehaviorSubject<IRefdataModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  constructor(private utilService: UtilsService,
              private localStorageService: LocalStorageService,
              private modalService: ModalService) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.modalService.registerModals(
      { modalName: 'add', modalComponent: AddRoleComponent });
    this.isLoading.next(true);
    const cred = this.localStorageService.getItem('userCredentials');
    const applicationId = cred['application_id'];
    const email = cred['email_address'];
    await forkJoin([
    this.utilService.getRole(this.utilService.getCompanyIdd(email), applicationId),
    this.utilService.getRoleAll(this.utilService.getCompanyIdd('ALL'), this.utilService.getApplicationID('ALL')),
    ]).toPromise().then(
      (data) => {
        this.roleManagementList =  data[0].concat(data[1]);
      });
    this.ELEMENT_DATA.next(this.roleManagementList);
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
      /* case('delete'): this.onChangeStatus(rowAction.data);*/
     }
  }
  updateRole(data) {
    this.modalService.displayModal('add', data,
      '657px', '599px');
  }
}
