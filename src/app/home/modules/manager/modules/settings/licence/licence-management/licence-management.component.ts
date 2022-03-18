import { Component, OnInit } from '@angular/core';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UserService } from '@core/services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LicenceService } from '@core/services/licence/licence.service';
import { ILicenceModel } from '@shared/models/licence.model';
import { ICompanyLicenceModel } from '@shared/models/companyLicence.model';

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
  listLicence: ILicenceModel[];
  companyLicenceList: any;
  startDate: Date;
  constructor(
    private appInitializerService: AppInitializerService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private licenceService: LicenceService,
  ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
  this.userService.connectedUser$.subscribe((data) => {
    this.companyEmail = data?.user[0]?.company_email;
    this.startDate = data['companylicence'][0]?.licence_start_date;
    this.typeLicence = data['companylicence'][0]?.companyLicenceKey.licence_code;
    this.periodicity = this.getPeriodicity(data['companylicence'][0]?.bill_periodicity);
    this.initForm();
    this.getCompanyLicence();

    this.getLicence();
  });
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      contactEmail: [{ value: this.companyEmail, disabled: true }],
      licenceType:  ['', [Validators.required]],
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

  getCompanyLicence() {
    this.licenceService.getCompanyLicence(`?application_id=5eac544a92809d7cd5dae21f&email_address=${this.companyEmail}`).subscribe((licence => {
      this.companyLicenceList = licence[0];
      this.form.controls['licenceType'].patchValue(this.companyLicenceList['companyLicenceKey']['licence_code']);
    }));
  }

  getLicence() {
    this.licenceService.getLicencesList().subscribe((data) => {
      this.listLicence = data;
    });
  }

  updateCompanyLicence() {
    const objectToUpdate = {
      application_id: this.companyLicenceList.companyLicenceKey.application_id,
      email_address: this.companyLicenceList.companyLicenceKey.email_address,
      licence_code: this.form.value.licenceType,
      licence_type: this.companyLicenceList.companyLicenceKey.licence_type,
      licence_start_date: this.companyLicenceList.licence_start_date,
      licence_end_date: this.companyLicenceList.licence_end_date,
      bill_periodicity: this.companyLicenceList.bill_periodicity,

  };
    this.licenceService.updateCompanyLicence(objectToUpdate).subscribe((data) => {
    });
  }

  getPeriodicity(code) {
    switch (code) {
      case ('M'): return 'monthly';
      case ('Y'): return 'yearly';
    }
  }
}
