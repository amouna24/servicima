import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/* rxjs */
import { Router } from '@angular/router';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '@core/services/profile/profile.service';
import { IUserModel } from '@shared/models/user.model';
@Component({
  selector: 'wid-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  usersList: IUserModel[] = [];
  filterArray: IUserModel[] = [];

  isLoading = false;
  constructor(private router: Router, private profileService: ProfileService) { }

  displayedColumns: string[] =
    ['firstname', 'lastname', 'email', 'type', 'title', 'created_by', 'status', 'actions'];
  dataSource: MatTableDataSource<IUserModel>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  /* loaded when component in init state */
  ngOnInit(): void {
    this.load();
    this.dataSource = new MatTableDataSource(this.usersList);
  }

  load() {
    this.profileService.getAllUser().subscribe((res) => {
      console.log(res);
      this.usersList = res;
      this.display(this.usersList);
    }

    );

  }

  /**
   * @description: Function to display data from modelList
   * @return: Data Source
   */
  display(data: IUserModel[]): void {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'firstname': {
          return item.first_name.toLowerCase();
        }
        case 'lastname': {
          return item.last_name.toLowerCase();
        }
        case 'type': {
          return item.user_type.toLowerCase();
        }
        case 'title': {
          return item.title_id.toLowerCase();
        }
        case 'created_by': {
          return item.created_by.toLowerCase();
        }
        case 'email': {
          return item.UserKey.email_adress.toLowerCase();
        }
        case 'status': {
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
  applyFilter(filterValue: string) {
    this.filterArray = [];
    this.usersList.filter(
      (res) => {
        if (
          res.UserKey.email_adress.toLowerCase().includes(filterValue.toLowerCase()) ||
          res.user_type.toLowerCase().includes(filterValue.toLowerCase()) ||
          res.title_id.toLowerCase().includes(filterValue.toLowerCase()) ||
          res.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          res.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          res.created_by.toLowerCase().includes(filterValue.toLowerCase())
        ) {
          this.filterArray.push(res);
        }
      },
    );

    if (this.dataSource.paginator) {
      this.display(this.filterArray);
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * @description: Function to navigate to add user
   */
  addNewUser(): void {

    this.router.navigate(['/manager/profile'], { queryParams: { onLoad: 'false', userEmail: '' } });

  }

}
