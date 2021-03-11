import { Component, OnInit } from '@angular/core';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { BehaviorSubject } from 'rxjs';
import { ILicenceModel } from '@shared/models/licence.model';

@Component({
  selector: 'wid-licence-management',
  templateUrl: './licence-management.component.html',
  styleUrls: ['./licence-management.component.scss']
})
export class LicenceManagementComponent implements OnInit {
  ELEMENT_DATA = new BehaviorSubject<ILicenceModel[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
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
    this.ELEMENT_DATA.next(this.appInitializerService.licencesList);
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    /* switch (rowAction.actionType) {
       case ('show'): this.showUser(rowAction.data);
         break;
       case ('update'): this.updateUser(rowAction.data);
         break;
       case('delete'): this.onChangeStatus(rowAction.data);
     }*/
  }

}
