import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IContractor } from '@shared/models/contractor.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { UserService } from '@core/services/user/user.service';
import { takeUntil } from 'rxjs/operators';

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
  private subscriptions: Subscription[] = [];

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserInfo;

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  displayedColumns: string[] = ['contractor_code', 'contractor_name', 'email_address',
    'contact_email', 'creation_date', 'status', 'Actions'];
  dataSource: MatTableDataSource<IContractor>;
  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  /*********** Contract Data Table ***********/
  contractorsList: IContractor[] = [];
  /*******************************************/

  constructor(
    private contractorService: ContractorsService,
    private userService: UserService,
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

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getInitialData();
  }

  /**************************************************************************
   * @description Get all Initial Data from [ /app_initializer, Services ]
   * From Assets: [ countries, currencies ]
   * From Services [ RefData, UserInfo ]
   * @return
   * 1 Getting Assets Data with fork join from app_initializer
   * 2 (after subs) Fetch refData [LEGAL_FORM, VAT, CONTRACT_STATUS] and
   * initialize local tables
   * 3 get current UserInfo
   *************************************************************************/
  getInitialData() {
    this.subscriptions.push(this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.userInfo = data;
        this.getContractors();
      }
    }));
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
    this.contractorService.getContractors(`?contractor_type=${this.type}&?email_address=${this.userInfo.user[0]['company_email']}`).subscribe(
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
    if ( this.type === 'SUPPLIER') {
      this.router.navigate(
        ['/manager/contract-management/suppliers-contracts/suppliers']);
    } else {
      this.router.navigate(
        ['/manager/contract-management/clients-contracts/clients']);
    }
  }

  /**************************************************************************
   * @description: Function to call  Dialog
   * @return: Updated Contractor Status
   *************************************************************************/
  onStatusChange(Contractor) {
    const confirmation = {
      sentence: 'to change the status of this user',
    };
    this.modalsServices.displayConfirmationModal(confirmation)
      .subscribe(
        (res) => {
          if (res === 'true') {
            console.log('resp:', res);
            if (Contractor.status === 'A') {
              this.contractorService.disableContractor(Contractor._id)
                .pipe(
                  takeUntil(this.destroy$)
                )
                .subscribe(
                (res1) => {
                  this.getContractors();
                }
              );
            } else if (Contractor.status === 'D') {
              this.contractorService.enableContractor(Contractor._id)
                .pipe(
                  takeUntil(this.destroy$)
                )
                .subscribe(
                (res1) => {
                  this.getContractors();
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
      ['/manager/contract-management/suppliers-contracts/suppliers'], { queryParams: {  id: btoa(Contractor._id) } });
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
