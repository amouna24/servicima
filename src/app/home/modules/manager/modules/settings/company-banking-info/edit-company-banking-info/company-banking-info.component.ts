import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '@core/services/user/user.service';
import { CompanyBankingInfoService } from '@core/services/company-banking-info/company-banking-info.service';
import { ICompanyBankingInfoModel } from '@shared/models/companyBankingInfo.model';

@Component({
  selector: 'wid-company-banking-info',
  templateUrl: './company-banking-info.component.html',
  styleUrls: ['./company-banking-info.component.scss']
})
export class CompanyBankingInfoComponent implements OnInit {
  form: FormGroup;
  companyEmail: string;
  companyName: string;
  companyBankingInfo: ICompanyBankingInfoModel;
  addOrUpdateForm: string;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private location: Location,
              private companyBankingInfoService: CompanyBankingInfoService) { }

  ngOnInit(): void {
    this.addOrUpdateForm = 'SETTINGS_ADD_COMPANY_BANKING';
    this.getConnectedUser();
    this.getCompanyBankingInfo();
    this.initForm();
  }

  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.patchValue({
      bicCode: this.companyBankingInfo['bic_code'],
      iban: this.companyBankingInfo['iban'],
      rib: this.companyBankingInfo['rib'],
      bankAddress: this.companyBankingInfo['bank_address'],
      factorInformation: this.companyBankingInfo['factor_informations'],
      bankDomiciliation: this.companyBankingInfo['bank_domiciliation'],
      bankName: this.companyBankingInfo['bank_name'],
      }
    );
    }

  /**
   * @description : get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$.subscribe(
      (userInfo) => {
        if (userInfo) {
          this.companyName = userInfo['company'][0].company_name;
          this.companyEmail = userInfo['company'][0].companyKey.email_address;
        }
      });
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      company: [{ value: this.companyName, disabled: true }],
      bicCode: ['', [Validators.required]],
      iban: ['', [Validators.required]],
      rib: ['', [Validators.required]],
      bankAddress: ['', [Validators.required]],
      bankDomiciliation: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      factorInformation: [''],
    });
  }

  /**
   * @description : Add or edit company banking information
   */
  addOrEdit() {
    const companyBankingInfo = {
      application_id: this.userService.applicationId,
      email_address: this.companyEmail,
      bank_address: this.form.value.bankAddress,
      bic_code: this.form.value.bicCode,
      iban: this.form.value.iban,
      rib: this.form.value.rib,
      factor_informations: this.form.value.factorInformation,
      bank_domiciliation: this.form.value.bankDomiciliation,
      bank_name: this.form.value.bankName,
    };

    if (this.companyBankingInfo) {
      this.companyBankingInfoService.updateCompanyBankingInfo(companyBankingInfo).subscribe((data) => {
        this.router.navigate(['/manager/settings/company-banking-info']);
           });
    } else {
      this.companyBankingInfoService.addCompanyBankingInfo(companyBankingInfo).subscribe((data) => {
        this.companyBankingInfo = data.CompanyBankingInfo;
        this.router.navigate(['/manager/settings/company-banking-info']);
      });
    }
  }

  /**
   * @description : get company banking information
   */
  getCompanyBankingInfo() {
    this.companyBankingInfoService.getCompanyBankingInfo(this.companyEmail).subscribe((data) => {
   if (data.length > 0) {
      this.companyBankingInfo = data[0];
      this.setForm();
      this.addOrUpdateForm = 'SETTINGS_UPDATE_COMPANY_BANKING';
   } else {
      this.addOrUpdateForm = 'SETTINGS_ADD_COMPANY_BANKING';
   }
    });

  }
  back() {
    this.location.back();
  }
}
