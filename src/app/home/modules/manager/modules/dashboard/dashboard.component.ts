import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { IUserModel } from '@shared/models/user.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'wid-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loaded: Promise<boolean>;
  ELEMENT_DATA: IUserModel[] = [];
  credentials: string;
  constructor(private userService: UserService,
              private profileService: ProfileService,
              private localStorageService: LocalStorageService,
              public dialog: MatDialog, ) {
    this.credentials = this.localStorageService.getItem('userCredentials');

    this.profileService.getAllUser( this.credentials['email_address']).subscribe((data) => {
      this.ELEMENT_DATA = data;
    this.loaded = Promise.resolve(true);
    });
  }

  ngOnInit(): void {
  }
}
