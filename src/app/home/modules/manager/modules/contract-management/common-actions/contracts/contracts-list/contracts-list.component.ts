import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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

  displayedColumns: string[] = ['contract_code', 'contractor_code', 'collaborator_email',
    'contract_status', 'show', 'Actions'];
  dataSource: MatTableDataSource<IContract>;
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
    console.log(this.type);
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(params => {
        if (!!params.contract_status) {
          this.searchCriteria = params.contract_status;
          this.getContracts();
        } else {
          this.searchCriteria = '';
          this.getContracts();
        }
      });
    this.addNewContract();
    this.modalsServices.registerModals(
      { modalName: 'showExtension', modalComponent: ShowExtensionComponent });
  }

  /**
   * @description Get Contracts List
   */
  getContracts() {
    this.isLoading.next(true);
    this.contractService.getContracts(
      // tslint:disable-next-line:max-line-length
      `?contract_type=${this.type}&email_address=${this.userService.connectedUser$.getValue().user[0]['company_email']}&contract_status=${this.searchCriteria}`
      )
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe(
      (response) => {
        this.ELEMENT_DATA.next(response);
        this.isLoading.next(false);
      },
      (error) => {
        this.isLoading.next(true);
        if (error.error.msg_code === '0004') {
          this.ELEMENT_DATA.next([]);
        }
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
    this.router.navigate(
      ['/manager/contract-management/suppliers-contracts/contracts'],
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
    switch (rowAction.actionType) {
      case ('show'): this.showContract(rowAction.data);
        break;
      case ('update'): this.updateContract(rowAction.data);
        break;
      case('delete'): console.log('EDIT ME');
    }
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
