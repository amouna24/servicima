import { Injectable } from '@angular/core';
import { IHoliday } from '@shared/models/holiday.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private weekDays: Array<{
    name: string,
    desc: string,
    holiday: IHoliday,
    hasHoliday: boolean,
  }> = [];
  constructor(
    private httpClient: HttpClient,
  ) {
    this.weekDays = this.initWeekDay();
  }
  /**
   * @description: initialize the week's days
   * @return: array of any
   */
  initWeekDay(): any[] {
    return [
      {
        name: 'monday',
        desc: 'Monday',
        holiday: { },
        hasHoliday: false,
      },
      {
        name: 'tuesday',
        desc: 'Tuesday',
        holiday: { },
        hasHoliday: false,
      },
      {
        name: 'wednesday',
        desc: 'Wednesday',
        holiday: { },
        hasHoliday: false,
      },
      {
        name: 'thursday',
        desc: 'Thursday',
        holiday: { },
        hasHoliday: false,
      },
      {
        name: 'friday',
        desc: 'Friday',
        holiday: { },
        hasHoliday: false,
      },
      {
        name: 'saturday',
        desc: 'Saturday',
        holiday: { },
        hasHoliday: false,
      },
      {
        name: 'sunday',
        desc: 'Sunday',
        holiday: { },
        hasHoliday: false,
      }
    ];
  }
  /**
   * @description: Get holidays list by country
   * @param: conuntryCode code country
   * @return: IHoliday
   */
  getHolidaysByCountry(countryCode: string): Observable<IHoliday[]> {
    return this.httpClient.get<IHoliday[]>(`${environment.timesheetHolidayApiUrl}?country=${countryCode}`);
  }
  /**************************************************************************
   * @description Get Timesheet List
   * @param filter search query like [ ?id=123 ]
   * @returns All Timesheet Observable<ITimesheet[]>
   *************************************************************************/
  getHolidays(filter: string): Observable<IHoliday[]> {
    return this.httpClient.get<IHoliday[]>(`${environment.timesheetHolidayApiUrl}${filter}`);
  }
  /**
   * @description: Get holidays of the chosen week
   * @param: countryCode startDate
   * @return: Promise<any[]>
   */
  getWeekHoliday(countryCode: string, startDate: string): Promise<any[]> {
    return new Promise(
      (resolve => {
        const firstDay = new Date(startDate);
        const lastDay = new Date(startDate);
        let monthHolidays;
        lastDay.setDate(firstDay.getDate() + 7);
        this.getHolidays(`?country=${countryCode}&month=${(firstDay.getMonth() + 1)}&month=${(firstDay.getMonth() + 1)}`)
          .toPromise().then((data) => {
          monthHolidays = data;
        }).finally(() => {
          let dd: any;
          for (let i = 0; i < 7; i++) {
            const dateDay = new Date(startDate);
            dateDay.setDate(dateDay.getDate() + i);
            dd = monthHolidays.find((res) => Number(res.day) === dateDay.getDate());
            this.weekDays[i].holiday = dd ? dd : null;
            this.weekDays[i].hasHoliday = !!dd;
          }
          resolve(this.weekDays);
        });
      })
    );
  }
}
