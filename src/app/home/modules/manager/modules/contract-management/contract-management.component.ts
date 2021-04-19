import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.scss']
})
export class ContractManagementComponent implements OnInit, OnDestroy {

  contractorList = new BehaviorSubject<any>([]);
  contractsList = new BehaviorSubject<any>([]);

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private contractorService: ContractorsService,
    private contractService: ContractsService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getContractors();
    this.getContracts();
  }

  /**************************************************************************
   * @description Get Contractors List
   * if response set the data to the DataTableSource
   * else return empty Table
   *************************************************************************/
  getContractors() {
    this.contractorService.getContractors(
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['company_email']}`
    ).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe(
        (response) => {
          this.contractorList.next(response);
        },
        (error) => {
          if (error.error.msg_code === '0004') {
            this.contractorList.next([]);
          }
        },
      );
  }

  /**************************************************************************
   * @description Get Contracts List
   *************************************************************************/
  getContracts() {
    this.contractService.getContracts(`?email_address=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.contractsList.next(response);
        },
        (error) => {
          if (error.error.msg_code === '0004') {
            this.contractsList.next([]);
          }
        },
      );
  }
  /**************************************************************************
   * @description Get Count of contracts/contractors
   * @return number of items
   *************************************************************************/
  getCount(type): number {
    console.log('d', this.contractsList.getValue());
    switch (type) {
      case 'CLIENT': return this.contractorList.getValue().filter(contractor => contractor.contractorKey.contractor_type === 'CLIENT').length;
      case 'SUPPLIER': return this.contractorList.getValue().filter(contractor => contractor.contractorKey.contractor_type === 'SUPPLIER').length;
      case 'CLIENT_C': return this.contractsList.getValue().filter(contract => contract.contract_type === 'CLIENT').length;
      case 'SUPPLIER_C': return this.contractsList.getValue().filter(contract => contract.contract_type === 'SUPPLIER').length;

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
