import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IContract } from '@shared/models/contract.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IContractExtension } from '@shared/models/contractExtension.model';
import { ModalService } from '@core/services/modal/modal.service';

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

  displayedColumns: string[] = ['contract_code', 'contractor_code', 'collaborator_email',
    'contract_status', 'show', 'Actions'];
  dataSource: MatTableDataSource<IContract>;

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  /* Static Customers And Status Declaration */
  Customers = [
    { email: 'olivier@europcar.fr', name: 'Olivier'},
    { email: 'frank@canalplus.fr', name: 'Frank'}
  ];
  Status = [
    { value: 'Signed', viewValue: 'Signed'},
    { value: 'Draft', viewValue: 'Draft'},
  ];
  /*******************************************/

  /*********** Contract Data Table ***********/
  contractsList: IContract[] = [];

  /*******************************************/

  constructor(
    private contractService: ContractsService,
    private router: Router,
    private modalsServices: ModalService,
  ) {
  }

  /**************************************************************************
   * @description load data emitted by child components
   *************************************************************************/
  ngOnChanges(changes: { [propKey: string]: SimpleChange}) {
    console.log(this.type);
  }

  ngOnInit(): void {
    this.getContracts();
    this.modalsServices.registerModals([
      { modalName: 'showExtension', modalComponent: ShowExtensionComponent }]);
  }

  /**
   * @description Filter Date with specific value
   * @param event Value to filter with
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * @description Get Contracts List
   */
  getContracts() {
    this.contractService.getContracts('').subscribe(
      (response) => {
        this.contractsList = response;
        this.dataSource = new MatTableDataSource(this.contractsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        if (error.error.msg_code === '0004') {
          this.contractsList = [];
          this.dataSource = new MatTableDataSource(this.contractsList);
        }
      },
    );
  }

  /**
   * @description Navigate to ADD NEW CONTRACT Components
   */
  addNewContract() {
    if ( this.type === 'SUPPLIER') {
      this.router.navigate(
        ['/manager/contract-management/suppliers-contracts/contracts'], { queryParams: {  id: '' } });
    } else {
      this.router.navigate(
        ['/manager/contract-management/clients-contracts/contract-create'], { queryParams: {  id: '' } });
    }
  }

  /**************************************************************************
   * @description: Show Contract
   * @param Contract Contract Object
   * @return: Contract
   *************************************************************************/
  showContact(Contract: IContract): void {
    this.contractService.getContractExtension(
      `?contract_code=${Contract.contractKey.contract_code}&email_address=${Contract.contractKey.email_address}`
    )
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        (res) => {
          this.contactExtensionInfo = res[0];
          this.modalsServices.displayModal('showExtension', { ext : this.contactExtensionInfo, file: Contract.attachments }, '40%')
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
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
