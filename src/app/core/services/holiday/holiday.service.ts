import { Injectable } from '@angular/core';
import { holidaysList } from '@shared/statics/holidays-list.static';
import { IHoliday } from '@shared/models/holiday.model';
@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private weekDays: any[] = [];
  constructor() {
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
        holiday: null,
        hasHoliday: false,
      },
      {
        name: 'tuesday',
        desc: 'Tuesday',
        holiday: null,
        hasHoliday: false,
      },
      {
        name: 'wednesday',
        desc: 'Wednesday',
        holiday: null,
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
        holiday: null,
        hasHoliday: false,
      },
      {
        name: 'sunday',
        desc: 'Sunday',
        holiday: null,
        hasHoliday: false,
      }
    ];
  }
  /**
   * @description: Get holidays list by country
   * @param: code country
   * @return: IHoliday
   */
  getHolidaysByCountry(countryCode: string): IHoliday {
   return  holidaysList.find(row => row.country === countryCode);
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
        lastDay.setDate(firstDay.getDate() + 7);
        const monthHolidays = this.getHolidaysByCountry(countryCode).holidays.filter(
          (day) => {
            return (Number(day.month) === (firstDay.getMonth() + 1) ||
              Number(day.month) === (lastDay.getMonth() + 1));
          }
        );
        let dd: any;
        for (let i = 0; i < 7; i++) {
          const dateDay = new Date(startDate);
          dateDay.setDate(dateDay.getDate() + i);
          dd = monthHolidays.find((res) => Number(res.day) === dateDay.getDate());
          this.weekDays[i].holiday = dd ? dd : null;
          this.weekDays[i].hasHoliday = !!dd;
        }
        resolve(this.weekDays);
      })
    );
  }
}
