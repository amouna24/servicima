import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyBankingInfoService } from '@core/services/company-banking-info/company-banking-info.service';
import { UserService } from '@core/services/user/user.service';
import { ICompanyBankingInfoModel } from '@shared/models/companyBankingInfo.model';

@Component({
  selector: 'wid-show-company-banking-info',
  templateUrl: './show-company-banking-info.component.html',
  styleUrls: ['./show-company-banking-info.component.scss']
})
export class ShowCompanyBankingInfoComponent implements OnInit {
  isLoading = false;
  companyEmail: string;
  companyName: string;
  bicCode: string;
  iban: string;
  rib: string;
  bankAddress: string;
  factorInformation: string;
  bankDomiciliation: string;
  addOrUpdateForm: string;
  bankName: string;
  companyBankingInfoExist = 'spinner';
  companyBankingInfo: ICompanyBankingInfoModel;
  constructor(private companyBankingInfoService: CompanyBankingInfoService,
    private userService: UserService,
    private router: Router, ) { }

  ngOnInit(): void {
    this.getConnectedUser();
    this.getCompanyBankingInfo();
  }
   /**
    * @description : get company banking Information
    */
  getCompanyBankingInfo() {
    this.companyBankingInfoService.getCompanyBankingInfo(this.companyEmail).subscribe((data) => {
      if (data.length > 0) {
        this.companyBankingInfoExist = 'company Banking Info';
        this.companyBankingInfo = data[0];
        this.addOrUpdateForm = 'SETTINGS_UPDATE_COMPANY_BANKING';
        this.setForm();
      } else {
        this.addOrUpdateForm = 'SETTINGS_ADD_COMPANY_BANKING';
        this.companyBankingInfoExist = 'no data';
      }
    });

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
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.bicCode = this.companyBankingInfo['bic_code'];
    this.iban = this.companyBankingInfo['iban'];
    this.rib = this.companyBankingInfo['rib'];
    this.bankAddress = this.companyBankingInfo['bank_address'];
    this.factorInformation = this.companyBankingInfo['factor_informations'];
    this.bankDomiciliation = this.companyBankingInfo['bank_domiciliation'];
    this.bankName = this.companyBankingInfo['bank_name'];
  }

  addCompanyBankingInfo() {
    this.router.navigate(['/manager/settings/company-banking-info/add']);
  }
  updateCompanyBankingInfo() {
    this.router.navigate(['/manager/settings/company-banking-info/update']);
  }
}
