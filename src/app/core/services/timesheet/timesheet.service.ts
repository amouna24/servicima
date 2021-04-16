import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITimesheet } from '@shared/models/timesheet.model';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  /*------------------------------------ TIMESHEET --------------------------------------*/

  /**************************************************************************
   * @description Get Timesheet List
   * @param filter search query like [ ?id=123 ]
   * @returns All Timesheet Observable<ITimesheet[]>
   *************************************************************************/
  getTimesheet(filter: string): Observable<ITimesheet[]> {
    return this.httpClient.get<ITimesheet[]>(`${environment.timesheetApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Timesheet
   * @param Timesheet: Timesheet Model
   *************************************************************************/
  addTimesheet(Timesheet: ITimesheet): Observable<any> {
    return this.httpClient.post<ITimesheet>(`${environment.timesheetApiUrl}`, Timesheet);
  }

  /**************************************************************************
   * @description Update Timesheet
   * @param timesheet: updated timesheet-test Object
   *************************************************************************/
  updateTimesheet(timesheet: ITimesheet): Observable<any> {
    return this.httpClient.put<ITimesheet>(`${environment.timesheetApiUrl}`, timesheet);
  }

  /**
   *
   */

}
