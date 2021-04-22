import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICompanyTimesheetSettingModel } from '@shared/models/CompanyTimesheetSetting.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetSettingService {

  constructor(private httpClient: HttpClient, ) { }

  /**
   * @description get company timesheet setting by company
   * @param email: email address
   */
  getCompanyTimesheetSetting(email: string) {
    return this.httpClient
      .get<ICompanyTimesheetSettingModel[]>(`${environment.companyTimesheetSettingApiUrl}?company_email=${email}`);
  }

  /**
   * @description update company timesheet setting
   * @param timesheetSetting: object to update
   */
  updateCompanyTimesheetSetting(timesheetSetting: object) {
    return this.httpClient
      .put(`${environment.companyTimesheetSettingApiUrl}`, timesheetSetting);
  }
}
