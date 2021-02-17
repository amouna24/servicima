import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';
import { ProfileService } from '@core/services/profile/profile.service';
import { IUserModel } from '@shared/models/user.model';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ICredentialsModel } from '@shared/models/credentials.model';
import { IViewParam } from '@shared/models/view.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'wid-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  usersList: IUserModel[] = [];
  filterArray: IUserModel[] = [];
  isLoading = false;
  code: string;
  companyId: string;
  credentials: ICredentialsModel;
  refData: { } = { };

  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
     private profileService: ProfileService,
     private userService: UserService,
     private utilsService: UtilsService,
     private modalService: ModalService,
     private localStorageService: LocalStorageService) { }

  displayedColumns: string[] =
    ['FirstName', 'LastName', 'Email', 'profileTypeDesc', 'profTitlesDesc', 'Created_by', 'Status', 'Actions'];
  dataSource: MatTableDataSource<IUserModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.companyId = data['company'][0]['_id'];
      }
    });
    this.load();
    this.dataSource = new MatTableDataSource(this.usersList);
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  getRefdata(): void {
    const list = [ 'PROF_TITLES', 'PROFILE_TYPE'];
    this.refData = this.utilsService.getRefData(this.companyId, this.credentials['application_id'],
     list);
  }

  /**
   * @description: load data
   */
  load(): void {
    this.credentials = this.localStorageService.getItem('userCredentials');
    this.profileService.getAllUser(this.credentials['email_address']).subscribe((res) => {
    this.getRefdata();
    res.forEach(element => {
    element['profileTypeDesc'] = this.refData['PROFILE_TYPE'].find((type: IViewParam) =>
    type.value === element['user_type']).viewValue;
    if (element['title_id']) {
    element['profTitlesDesc'] = this.refData['PROF_TITLES'].find((title: IViewParam) =>
    title.value === element['title_id']).viewValue;
    }
  });
      this.usersList = res;
      this.display(this.usersList);
    }
    );
  }

  /**
   * @description: Function to display data from modelList
   * @return: Data Source
   */
  display(user: IUserModel[]): void {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(user);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'FirstName': {
          return item.first_name.toLowerCase();
        }
        case 'LastName': {
          return item.last_name.toLowerCase();
        }
        case 'Created_by': {
          return item.created_by.toLowerCase();
        }
        case 'Email': {
          return item['userKey']['email_address'].toLowerCase();
        }
        case 'Status': {
          return item.status.toLowerCase();
        }
        default: {
          return item[property];
        }
      }
    };
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

  /**
   * @params filterValue
   * @description table filter
   */
  applyFilter(filterValue: string): void {
    this.filterArray = [];
    this.usersList.filter(
      (listUser) => {
        if (
          listUser['userKey']['email_address'].toLowerCase().includes(filterValue.toLowerCase()) ||
          listUser.user_type.toLowerCase().includes(filterValue.toLowerCase()) ||
          listUser.title_id.toLowerCase().includes(filterValue.toLowerCase()) ||
          listUser.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          listUser.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          listUser.created_by.toLowerCase().includes(filterValue.toLowerCase())
        ) {
          this.filterArray.push(listUser);
        }
      },
    );

    if (this.dataSource.paginator) {
      this.display(this.filterArray);
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * @description: navigate to add user
   */
  addNewUser(): void {
    this.router.navigateByUrl('/manager/settings/users/add-user', { state: { 'user': 'user'} });
  }

  /**
   * @description: navigate to the detail of the user
   * @param id: string
   */
  goTodetailUser(id: string): void {
    this.router.navigate(['/manager/settings/users/update-user'],
      {
        queryParams: {
          'id': id
        }
      });
  }

  /**
   * @description : change the status of the user
   * @param id: string
   * @param status: string
   */
  onChangeStatus(id: string, status: string) {
    const confirmation = {
      sentence: 'to change the status of this user',
    };

    this.subscriptionModal = this.modalService.displayConfirmationModal(confirmation).subscribe((value) => {
      if (value === true) {
        this.subscriptions.push( this.profileService.userChangeStatus(id, status, this.credentials['email_address']).subscribe(
          () => {
            this.load();
          },
          (err) => console.error(err),
        ));
        this.subscriptionModal.unsubscribe();
      }
    });
      }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
