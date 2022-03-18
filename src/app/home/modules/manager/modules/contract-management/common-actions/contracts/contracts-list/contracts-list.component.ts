import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { IContract } from '@shared/models/contract.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IContractExtension } from '@shared/models/contractExtension.model';
import { ModalService } from '@core/services/modal/modal.service';
import { UserService } from '@core/services/user/user.service';

import { ShowExtensionComponent } from '../show-extension/show-extension.component';

@Component({
  selector: 'wid-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss']
})
export class ContractsListComponent implements OnInit, OnChanges, OnDestroy {

  /**************************************************************************
   * @description Input from child's Components [SUPPLIERS, CLIENTS]
   *************************************************************************/
  @Input() type: string;
  @Input() title: string;

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  contactExtensionInfo: IContractExtension;

  /**************************************************************************
   * @description Input from child's Components [SUPPLIERS, CLIENTS]
   *************************************************************************/
  redirectUrl: string;
  addButtonLabel: string;
  tabFeatureAccess = [{ name: '', feature: ''}];

  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);

  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  /**************************************************************************
   * @description search Criteria
   *************************************************************************/
  searchCriteria: string;

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  constructor(
      private contractService: ContractsService,
      private router: Router,
      private route: ActivatedRoute,
      private modalsServices: ModalService,
      private userService: UserService,
  ) {
  }

  /**************************************************************************
   * @description load data emitted by child components
   *************************************************************************/
  ngOnChanges(changes: { [propKey: string]: SimpleChange}) {
  }

  ngOnInit(): void {
    this.route.queryParams
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe(params => {
          if (!!params.contract_status) {
            this.searchCriteria = params.contract_status;
            this.getContracts(this.nbtItems.getValue(), 0);
          } else {
            this.searchCriteria = '';
            this.getContracts(this.nbtItems.getValue(), 0);
          }
        });
    this.addNewContract();
    this.modalsServices.registerModals(
        { modalName: 'showExtension', modalComponent: ShowExtensionComponent });
  }

  /**
   * @description Get Contracts List
   */
  getContracts(limit, offset) {
    this.isLoading.next(true);
    this.contractService.getContracts(
        // tslint:disable-next-line:max-line-length
        `?beginning=${offset}&number=${limit}&contract_type=${this.type}&email_address=${this.userService.connectedUser$.getValue().user[0]['company_email']}&contract_status=${this.searchCriteria}`
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
  /**
   * @description Navigate to ADD NEW CONTRACT Components
   */
  addNewContract() {
    if ( this.type === 'SUPPLIER') {
      this.redirectUrl = '/manager/contract-management/suppliers-contracts/contracts';
      this.addButtonLabel = 'New Contract';
    } else {
      this.redirectUrl = '/manager/contract-management/clients-contracts/contracts';
      this.addButtonLabel = 'New Contract';
    }
    this.tabFeatureAccess = [
      { name: 'TRLcontracts.show', feature: 'CONTRACT_DISPLAY'},
      { name: 'contracts.update', feature: 'CONTRACT_UPDATE'},
        { name: 'contracts.delete', feature: 'CONTRACT_DELETE'},
        { name: 'contracts.archive', feature: 'CONTRACT_ARCHIVE'},
    ];
  }

  /**************************************************************************
   * @description: Show Contract
   * @param Contract Contract Object
   * @return: Contract
   *************************************************************************/
  showContract(Contract: IContract): void {
    this.contractService.getContractExtension(
        `?contract_code=${Contract.contractKey.contract_code}&email_address=${Contract.contractKey.email_address}`
    )
        .pipe(
            takeUntil(this.destroy$),
        )
        .subscribe(
            (res) => {
              this.contactExtensionInfo = res[0];
              this.modalsServices.displayModal(
                  'showExtension',
                  {
                    contract: Contract,
                    ext : this.contactExtensionInfo,
                    file: Contract.attachments
                  },
                  '55%')
                  .pipe(
                      takeUntil(this.destroy$)
                  )
                  .subscribe(
                      (resp) => {
                        console.log(resp);
                      }
                  );
            },
            (error) => {
              console.log(error);
            }
        );
  }

  /**************************************************************************
   * @description: Function to call updateMail Dialog with current data
   * @param Contract contractor Object
   * @return: Updated Table
   *************************************************************************/
  updateContract(Contract: IContract): void {
    let url = '';
    if (Contract.contractKey.contract_type === 'SUPPLIER') {
      url = '/manager/contract-management/suppliers-contracts/contracts';
    } else {
      url = '/manager/contract-management/clients-contracts/contracts';
    }
    this.router.navigate(
        [url],
        { queryParams: {
            id: btoa(Contract._id),
            cc: btoa(Contract.contractKey.contract_code),
            ea: btoa(Contract.contractKey.email_address)
          }
        });
  }
  /**************************************************************************
   * @description: Function to call updateMail Dialog with current data
   * @param rowAction contract Object
   * @return: Updated Table
   *************************************************************************/
  switchAction(rowAction: any) {
    switch (rowAction.actionType.name) {
      case ('contracts.show'): this.showContract(rowAction.data);
        break;
      case('contracts.delete'): console.log('EDIT ME');
        break;
      case('contracts.archive'): console.log('EDIT ME');
        break;
      case('update'):
        this.updateContract(rowAction.data);
        break;
    }
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getContracts(params.limit, params.offset);
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
