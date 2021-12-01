import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';
import { TimesheetSettingService } from '@core/services/timesheet-setting/timesheet-setting.service';

import { IUserModel } from '@shared/models/user.model';
import { ICompanyPaymentTermsModel } from '@shared/models/companyPaymentTerms.model';
import { ICompanyTaxModel } from '@shared/models/companyTax.model';
import { ICompanyTimesheetSettingModel } from '@shared/models/CompanyTimesheetSetting.model';

@Component({
  selector: 'wid-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  listUsers: IUserModel[] = [];
  refData: { };
  companyPaymentTerms: ICompanyPaymentTermsModel[];
  companyTax: ICompanyTaxModel[];
  companyTimesheetSetting: ICompanyTimesheetSettingModel[];
  emailAddress: string;
  constructor( private profileService: ProfileService,
               private userService: UserService,
               private refDataService: RefdataService,
               private utilService: UtilsService,
               private companyPaymentTermsService: CompanyPaymentTermsService,
               private companyTaxService: CompanyTaxService,
               private timesheetSettingService: TimesheetSettingService, ) { }

  ngOnInit(): void {
    this.getConnectedUser();
    this.getAllUsers();
    this.getRefData().then((refData) => {
      this.refData = refData;
      }
    );
    this.getPaymentInformation();
    this.getCompanyTax();
    this.getTimesheetSettings();
  }
  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  /**
   * @description Get All users
   */
  getAllUsers() {
    this.profileService.getAllUser(this.emailAddress)
      .subscribe((res) => {
        this.listUsers = res['results'];
      }, error => console.error(error));
  }

    /**************************************************************************
     * @description Get Count
     * @return type of items
     *************************************************************************/
   getCount(type): number {
      switch (type) {
        case 'CANDIDATE': return this.listUsers.filter(user => user.user_type === 'CANDIDATE').length;
        case 'COLLABORATOR': return this.listUsers.filter(user => user.user_type === 'COLLABORATOR').length;
        case 'STAFF': return this.listUsers.filter(user => user.user_type === 'STAFF').length;
        case 'ALL': return this.listUsers.length;
        case 'ROLE': return this.refData ? this.refData['ROLE'].length : 0;
        case 'PAYMENT_MODE': return this.refData ? this.refData['PAYMENT_MODE'].length : 0;
        case 'PAYMENT_INFO': return this.companyPaymentTerms ? this.companyPaymentTerms.length : 0;
        case 'TAX': return this.companyTax ? this.companyTax.length : 0;
        case 'TIMESHEET_SETTING': return this.companyTimesheetSetting ? this.companyTimesheetSetting.length : 0;
      }
    }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefData() {
    const list = ['PAYMENT_MODE', 'ROLE'];
    return await this.refDataService
      .getRefData( this.utilService.getCompanyId(this.emailAddress, this.userService.applicationId) , this.userService.applicationId,
        list, true);
  }

  /**
   * @description Get payment information
   */
  getPaymentInformation() {
    this.companyPaymentTermsService.getCompanyPaymentTerms(this.emailAddress, 'ACTIVE').subscribe((data) => {
      this.companyPaymentTerms = data;
    }, error => console.error(error));
  }

  /**
   * @description Get company tax
   */
  getCompanyTax() {
    this.companyTaxService.getCompanyTax(this.emailAddress).subscribe((data) => {
    this.companyTax = data;
    }, error => console.error(error));
  }

  /**
   * @description Get timesheet settings
   */
  getTimesheetSettings() {
    this.timesheetSettingService.getCompanyTimesheetSetting(this.emailAddress).subscribe((data) => {
    this.companyTimesheetSetting = data;
    }, error => console.error(error));
  }
}
