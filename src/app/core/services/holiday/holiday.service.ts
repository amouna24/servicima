import { Injectable } from '@angular/core';
import { IHoliday } from '@shared/models/holiday.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environment/environment';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { IRefdataModel } from '@shared/models/refdata.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private refData: IRefdataModel[];
  public weekDays: Array<{
    name: string,
    desc: string,
    holiday: IHoliday,
    hasHoliday: boolean,
  }> = [];
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private refdataService: RefdataService,
    private userService: UserService,
    private utilService: UtilsService
  ) {
    this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.weekDays = this.initWeekDay(data.user[0]['company_email']);
        }
      });
  }

  getRefData(companyEmail): Promise<IRefdataModel[]> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise( resolve => {
      console.log(this.localStorageService.getItem('userCredentials')['application_id']);
      this.refdataService.getRefData(
        this.utilService.getCompanyId( companyEmail, this.localStorageService.getItem('userCredentials')['application_id']),
        this.localStorageService.getItem('userCredentials')['application_id'], ['WEEK_DAYS'], false).then(
        (res) => { resolve(res); }
      );
    });
  }
  /**
   * @description: initialize the week's days
   * @return: array of any
   */
  private initWeekDay(companyEmail): any[] {
    this.getRefData(companyEmail).then(
      (res) => { console.log(res); }
    );
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
