import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IContractor } from '@shared/models/contractor.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IContractorContact } from '@shared/models/contractorContact.model';
import { takeUntil } from 'rxjs/operators';
import { IUserInfo } from '@shared/models/userInfo.model';
import { UserService } from '@core/services/user/user.service';
import { UploadService } from '@core/services/upload/upload.service';

import { ShowModalComponent } from '../show-modal/show-modal.component';

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
   * @description Input from child's Components [SUPPLIERS, CLIENTS]
   *************************************************************************/
  redirectUrl: string;
  addButtonLabel: string;

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  private subscriptions: Subscription[] = [];
  subscriptionModal: Subscription;
  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserInfo;
  contractorContactInfo: IContractorContact;
  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  displayedColumns: string[] = ['contractor_code', 'contractor_name', 'email_address',
    'contact_email', 'creation_date', 'status', 'show', 'Actions'];
  dataSource: MatTableDataSource<IContractor>;
  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  /*********** Contract Data Table ***********/
  contractorsList: IContractor[] = [];
  /*******************************************/
  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  constructor(
    private contractorService: ContractorsService,
    private userService: UserService,
    private router: Router,
    private modalsServices: ModalService,
    private uploadService: UploadService,
  ) {
  }

  /**************************************************************************
   * @description load data emitted by child components
   *************************************************************************/
  ngOnChanges(changes: { [propKey: string]: SimpleChange}) {
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getInitialData();
    this.addNewContractors();
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
    this.modalsServices.registerModals(
      { modalName: 'showContact', modalComponent: ShowModalComponent });
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
    this.isLoading.next(true);
    this.contractorService.getContractors(
      `?contractor_type=${this.type}&email_address=${this.userService.connectedUser$.getValue().user[0]['company_email']}`
    ).pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
      (response) => {
        this.contractorsList = response;
        this.ELEMENT_DATA.next(this.contractorsList);
        this.isLoading.next(false);
      },
      (error) => {
        if (error.error.msg_code === '0004') {
          this.ELEMENT_DATA.next([]);
        }
      },
    );
  }

  /**************************************************************************
   * @description Navigate to ADD NEW CONTRACTOR Components
   *************************************************************************/
  addNewContractors() {
    if ( this.type === 'SUPPLIER') {
      this.redirectUrl = '/manager/contract-management/suppliers-contracts/suppliers';
      this.addButtonLabel = 'New Supllier';
    } else {
      this.redirectUrl = '/manager/contract-management/clients-contracts/clients';
      this.addButtonLabel = 'New Client';
    }
  }

  /**************************************************************************
   * @description: Function to call  Dialog
   * @return: Updated Contractor Status
   *************************************************************************/
  onStatusChange(Contractor) {
    console.log('contra', Contractor);
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      status: Contractor['status']
    };
    this.subscriptionModal = this.modalsServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {
            if (Contractor.status === 'A') {
              this.contractorService.disableContractor(Contractor._id)
                .pipe(
                  takeUntil(this.destroy$)
                )
                .subscribe(
                (res1) => {
                  console.log('A', res1);
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
                  console.log('D', res1);
                  this.getContractors();
                }
              );
            }
            this.subscriptionModal.unsubscribe();
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
      ['/manager/contract-management/suppliers-contracts/suppliers'],
      { queryParams: {
          id: btoa(Contractor._id),
          cc: btoa(Contractor.contractorKey.contractor_code),
          ea: btoa(Contractor.contractorKey.email_address)
      }
      });
  }

  /**************************************************************************
   * @description: Show Contact
   * @param Contractor contractor Object
   * @return: Contact of Contractor
   *************************************************************************/
  async showContact(Contractor: IContractor) {
      this.contractorService.getContractorsContact(
        `?contractor_code=${Contractor.contractorKey.contractor_code}&email_address=${Contractor.contractorKey.email_address}`
      )
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        (res) => {
          this.contractorContactInfo = res[0];
          this.modalsServices.displayModal(
            'showContact',
            {
              contractor: Contractor,
              contractorInfo: this.contractorContactInfo,
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

  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): this.showContact(rowAction.data);
      break;
      case ('update'): this.updateContractor(rowAction.data);
      break;
      case('delete'): this.onStatusChange(rowAction.data);
    }
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
