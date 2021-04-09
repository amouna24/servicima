import { Component, OnInit } from '@angular/core';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UserService } from '@core/services/user/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'wid-licence-management',
  templateUrl: './licence-management.component.html',
  styleUrls: ['./licence-management.component.scss']
})
export class LicenceManagementComponent implements OnInit {
  form: FormGroup;
  typeLicence: string;
  periodicity: string;
  companyEmail: string;
  startDate: Date;
  constructor(
    private appInitializerService: AppInitializerService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
  this.userService.connectedUser$.subscribe((data) => {
    this.companyEmail = data.user[0].company_email;
    this.startDate = data['companylicence'][0].licence_start_date;
    this.typeLicence = data['companylicence'][0].companyLicenceKey.licence_code;
    this.periodicity = this.getPeriodicity(data['companylicence'][0].bill_periodicity);
    this.initForm();
  });
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      contactEmail: [{ value: this.companyEmail, disabled: true }],
    });
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

  backClicked() {

  }

  getPeriodicity(code) {
    switch (code) {
      case ('M'): return 'monthly';
      case ('Y'): return 'yearly';
    }
  }
}
