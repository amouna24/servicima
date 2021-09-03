import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITimesheetModel } from '@shared/models/timesheet.model';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(
    private httpClient: HttpClient,
  ) {}

  /*------------------------------------ TIMESHEET --------------------------------------*/
  /**************************************************************************
   * @description Get Timesheet List
   * @param filter search query like [ ?id=123 ]
   * @returns All Timesheet Observable<ITimesheet[]>
   *************************************************************************/
  getTimesheet(filter: string): Observable<ITimesheetModel[]> {
    return this.httpClient.get<ITimesheetModel[]>(`${environment.timesheetApiUrl}${filter}`);
  }

  /**************************************************************************
   * @description Add new Timesheet
   * @param Timesheet: Timesheet Model
   *************************************************************************/
  addTimesheet(Timesheet: ITimesheetModel): Observable<any> {
    return this.httpClient.post<ITimesheetModel>(`${environment.timesheetApiUrl}`, Timesheet);
  }

  /**************************************************************************
   * @description Update Timesheet
   * @param timesheet: updated timesheet Object
   *************************************************************************/
  updateTimesheet(timesheet: any): Observable<any> {
    return this.httpClient.put<ITimesheetModel>(`${environment.timesheetApiUrl}`, timesheet);
  }

  /**************************************************************************
   * @description Delete Timesheet
   * @param ID : of the timesheet
   *************************************************************************/
  deleteTimesheet(id: string): Observable<any> {
    return this.httpClient.delete<ITimesheetModel>(`${environment.timesheetApiUrl}?_id=${id}`);
  }
}
