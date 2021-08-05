import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { UserService } from '@core/services/user/user.service';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { takeUntil } from 'rxjs/operators';

import { AddProjectComponent } from '../add-project/add-project.component';

@Component({
  selector: 'wid-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit, OnDestroy {

  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);
  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private contractService: ContractsService,
  ) { }

  ngOnInit(): void {
    this.modalService.registerModals(
      { modalName: 'addProject', modalComponent: AddProjectComponent });
  }

  /**
   * @description Get Projects List
   */
  getProjects(limit, offset) {
    this.isLoading.next(true);
    this.contractService.getContractProject(
      // tslint:disable-next-line:max-line-length
      `?beginning=${offset}&number=${limit}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`
    )
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe(
        (response) => {
          this.ELEMENT_DATA.next(response);
          response['results'].length >= 0 ? this.isLoading.next(false) : this.isLoading.next(true);
        },
        (error) => {
          this.isLoading.next(true);
        },
      );
  }

  /**************************************************************************
   * @description:update Project
   * @param data project Object
   * @return: Updated Table
   *************************************************************************/
  updateProject(data) {
    this.modalService.displayModal('addProject', data,
      '657px', '480px').subscribe((res) => {
      if (res) {
        this.getProjects(this.nbtItems.getValue(), 0);
      }
    });
  }

  /**************************************************************************
   * @description: Function to call updateMail Dialog with current data
   * @param rowAction contract Object
   * @return: Updated Table
   *************************************************************************/
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): console.log('EDIT ME');
        break;
      case ('update'): console.log('EDIT ME');
        break;
      case('delete'): console.log('EDIT ME');
    }
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    // this.getContracts(params.limit, params.offset);
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
