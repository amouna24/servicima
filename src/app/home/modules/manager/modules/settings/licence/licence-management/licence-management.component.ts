import { Component, OnInit } from '@angular/core';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';

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
  constructor(private appInitializerService: AppInitializerService) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
      this.ELEMENT_DATA = this.appInitializerService.licencesList;
   // to review
    this.ELEMENT_DATA.forEach((data) => {
      data['licence_code'] = data['LicenceKey'].licence_code;
    });
  }

}
