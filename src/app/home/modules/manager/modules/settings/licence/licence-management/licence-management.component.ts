import { Component, OnInit } from '@angular/core';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';

@Component({
  selector: 'wid-licence-management',
  templateUrl: './licence-management.component.html',
  styleUrls: ['./licence-management.component.scss']
})
export class LicenceManagementComponent implements OnInit {
  loaded: Promise<boolean>;
  ELEMENT_DATA = [];
  licence = [];
  licence_code;
  constructor(
    private appInitializerService: AppInitializerService,
    private profileService: ProfileService,
  ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
/*      this.ELEMENT_DATA = this.appInitializerService.licencesList;
   // to review
    this.ELEMENT_DATA.forEach((data) => {
      data['licence_code'] = data['LicenceKey'].licence_code;
    });*/
  /*  this.profileService.getAllUser('dhia.othmen@widigital-group.com').subscribe(async (res) => {
      if (!!res ) {
        this.ELEMENT_DATA = res;
        console.log(res);
        this.ELEMENT_DATA.forEach((data) => {
          data['email_address'] = data['userKey'].email_address;
          data['application_id'] = data['userKey'].application_id;
        });
      }

  });*/

  }

  updateOrDelete(rowID: string) {
    console.log('rowID', rowID);
  }

  showRowData(rowData: any) {
    console.log('rowData', rowData);
  }

}
