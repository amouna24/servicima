import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountry } from '@shared/models/countries.model';
import { IActivity } from '@shared/models/activity.model';
import { ICurrency } from '@shared/models/currency.model';
import { ICities } from '@shared/models/cities.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsDataService {

  allCountries: string;
  activityCode: string;
  allCurrencies: string;
  zipCode: string;

  citiesList: ICities[] = [];

  constructor(
    private httpClient: HttpClient,
  ) {
    this.initData();
  }

  /**************************************************************************
   * @description : init environment variable and objects construction
   *************************************************************************/
  initData() {
    this.allCountries = 'assets/data/countries.json';
    this.allCurrencies = 'assets/data/currencies.json';
    this.activityCode = 'assets/data/activityCode.json';
    this.zipCode = environment.zipCodeApiUrl;
  }

  /**************************************************************************
   * @description Get city
   * @param zipCode: zip code
   * @return city
   *************************************************************************/
  getCity(zipCode: string): Observable<any>  {
    return this.httpClient.get(`${this.zipCode}/${zipCode}`);
  }

  /**************************************************************************
   * @description Get all countries
   * @returns all countries
   *************************************************************************/
  getAllCountries(): Observable<ICountry[]>  {
    return this.httpClient.get<ICountry[]>(this.allCountries);
  }

  /**************************************************************************
   * @description Get all currencies
   * @return all currencies
   *************************************************************************/
  getAllCurrencies(): Observable<ICurrency[]> {
    return this.httpClient.get<ICurrency[]>(this.allCurrencies);
  }

  /**************************************************************************
   * @description Get all activity code
   * @return all  activity code
   *************************************************************************/
  getAllActivityCode(): Observable<IActivity[]> {
    return this.httpClient.get<IActivity[]>(this.activityCode);
  }
}
