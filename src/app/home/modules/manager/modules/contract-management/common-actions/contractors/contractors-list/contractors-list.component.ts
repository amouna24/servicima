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
// tslint:disable-next-line:origin-ordered-imports
import { ContractsService } from '@core/services/contracts/contracts.service';
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
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);
  blocData = [];

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
    'contact_email', 'Actions'];
  dataSource: MatTableDataSource<IContractor>;
  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(true);

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  constructor(
    private contractorService: ContractorsService,
    private contractService: ContractsService,
    private userService: UserService,
    private router: Router,
    private modalsServices: ModalService,
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
    this.subscriptions.push(
      this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.userInfo = data;
        this.getContractors(this.nbtItems.getValue(), 0);
      }
    })
    );
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
  getContractors(limit, offset) {
    this.isLoading.next(true);
    this.contractorService.getContractors(
      // tslint:disable-next-line:max-line-length
      `?beginning=${offset}&number=${limit}&contractor_type=${this.type}&email_address=${this.userService.connectedUser$.getValue().user[0]['company_email']}`
    ).pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
      (response) => {
        this.blocData = response['results'];
        this.ELEMENT_DATA.next(this.blocData);

        response['results'].length >= 0 ? this.isLoading.next(false) : this.isLoading.next(true);
      },
      (error) => {
        this.isLoading.next(true);
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
  onStatusChange(Contractor: IContractor, status: string): void {
    const confirmation = {
      code: 'changeStatus',
      title: 'change the status',
      description: `Are you sure you want to change status ?`,
    };
    this.subscriptionModal = this.modalsServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {

            const element = this.blocData.filter(x => x._id === Contractor._id)[0];
            const index = this.ELEMENT_DATA.value.indexOf(element);
            if (status === 'DISABLED') {
              if (index !== -1) {
                this.blocData.splice(index, 1);
                this.ELEMENT_DATA.next(this.blocData.slice());
                this.contractorService.disableContractor(Contractor._id)
                  .pipe(
                    takeUntil(this.destroy$)
                  )
                  .subscribe(
                    (res1) => {

                    }
                  );
              }

            } else if (Contractor.status === 'ACTIVE') {
              if (index !== -1) {
                this.contractorService.enableContractor(Contractor._id)
                  .pipe(
                    takeUntil(this.destroy$)
                  )
                  .subscribe(
                    (res1) => {
                      this.getContractors(this.nbtItems.getValue(), 0);
                    }
                  );
              }

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
    let url = '';
    if (Contractor.contractor_type === 'SUPPLIER') {
      url = '/manager/contract-management/suppliers-contracts/suppliers';
    } else {
      url = '/manager/contract-management/clients-contracts/clients';
    }
    console.log('url ', url);
    this.router.navigate(
      [url],
      { queryParams: {
          id: btoa(Contractor._id),
          cc: btoa(Contractor.contractorKey.contractor_code),
          ea: btoa(Contractor.contractorKey.email_address)
      }
      });
  }
  /**************************************************************************
   * @description: Function to call updateMail Dialog with current data
   * @param Contractor contractor Object
   * @return: Updated Table
   *************************************************************************/
  deleteContractor(Contractor: IContractor): void {
    const confirmation = {
      code: 'delete',
      title: 'delete Info',
      description: `Are you sure you want to delete ?`,
    };
    this.subscriptionModal = this.modalsServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
          if (res === true) {
             this.contractorService.disableContractor(Contractor._id).pipe(
               takeUntil(this.destroy$)
             ).subscribe(

             );
          }
      }

      );
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
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**************************************************************************
   * @description get selected Action From Dynamic DataTABLE
   * @param rowAction Object { data, rowAction }
   * data _id
   * rowAction [show, update, delete]
   *************************************************************************/
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): this.showContact(rowAction.data);
      break;
      case ('update'): this.updateContractor(rowAction.data);
      break;
     case('disabled'): this.onStatusChange(rowAction.data, 'DISABLED');
     break;
      case('active'): this.onStatusChange(rowAction.data, 'ACTIVE');
      break;
    }
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getContractors(params.limit, params.offset);
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
