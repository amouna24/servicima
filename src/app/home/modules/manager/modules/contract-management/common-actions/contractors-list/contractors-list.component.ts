import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IContractor } from '@shared/models/contractor.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-contractors-list',
  templateUrl: './contractors-list.component.html',
  styleUrls: ['./contractors-list.component.scss']
})
export class ContractorsListComponent implements OnInit, OnChanges, OnDestroy {

  /**************************************************************************
   * @description Input from child's Components [SUPPLIERS, CLIENTS]
   *************************************************************************/
  @Input() type: string;
  @Input() title: string;

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = ['contractor_code', 'contractor_name', 'email_address',
    'contact_email', 'creation_date', 'status', 'Actions'];

  dataSource: MatTableDataSource<IContractor>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* Static Customers And Status Declaration */
  Customers = [
    { email: 'olivier@europcar.fr', name: 'Olivier' },
    { email: 'frank@canalplus.fr', name: 'Frank' }
  ];
  Status = [
    { value: 'Signed', viewValue: 'Signed' },
    { value: 'Draft', viewValue: 'Draft' },
  ];
  /*******************************************/

  /*********** Contract Data Table ***********/
  contractorsList: IContractor[] = [];
  /*******************************************/

  constructor(
    private contractorService: ContractorsService,
    private router: Router,
    private modalsServices: ModalService,
  ) {
  }

  /**************************************************************************
   * @description load data emitted by child components
   *************************************************************************/
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log(this.type);
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getContractors();
  }

  /**************************************************************************
   * @description Filter Date with specific value
   * @param event Value to filter with
   *************************************************************************/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**************************************************************************
   * @description: Function to display data from modelList
   * @return: Data Source
   *************************************************************************/
  display(data: IContractor[]): void {
    this.dataSource = new MatTableDataSource(data.reverse());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**************************************************************************
   * @description Get Contractors List
   * if response set the data to the DataTableSource
   * else return empty Table
   *************************************************************************/
  getContractors() {
    this.contractorService.getContractors('').subscribe(
      (response) => {
        this.contractorsList = response;
        this.display(this.contractorsList);
      },
      (error) => {
        if (error.error.msg_code === '0004') {
          this.contractorsList = [];
          this.display(this.contractorsList);
        }
      },
    );
  }

  /**************************************************************************
   * @description Navigate to ADD NEW CONTRACTOR Components
   *************************************************************************/
  addNewContractors() {
    if (this.type === 'SUPPLIER') {
      this.router.navigate(
        ['/manager/contract-management/suppliers-contracts/suppliers'], { queryParams: { id: '' } });
    } else {
      this.router.navigate(
        ['/manager/contract-management/clients-contracts/clients'], { queryParams: { id: '' } });
    }
  }

  /**************************************************************************
   * @description: Function to call  Dialog
   * @return: Updated Contractor Status
   *************************************************************************/
  onStatusChange(Contractor) {
    this.modalsServices.displayConfirmationModal({ test: 'test' })
      .subscribe(
        (res) => {
          if (res === 'true') {
            if (Contractor.status === 'A') {
              this.contractorService.disableContractor(Contractor._id).subscribe(
                (res1) => {
                  console.log('resp:', res1);
                }
              );
            } else if (Contractor.status === 'D') {
              this.contractorService.enableContractor(Contractor._id).subscribe(
                (res1) => {
                  console.log('resp:', res1);
                }
              );
            }
          }
        }
      );
  }

  /**************************************************************************
   * @description: Function to call updateMail Dialog with current data
   * @param Contractor contractor Object
   * @return: Updated Table
   *************************************************************************/
  updateContractor(Contractor: IContractor): void {
    this.router.navigate(
      ['/manager/contract-management/suppliers-contracts/suppliers'], { queryParams: { id: btoa(Contractor._id) } });
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
