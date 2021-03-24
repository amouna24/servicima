import { Injectable } from '@angular/core';
import { ILicenceModel } from '@shared/models/licence.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { HttpClient } from '@angular/common/http';
import { ILicenceFeatureModel } from '@shared/models/licenceFeature.model';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {
  licenceFeatures: ILicenceFeatureModel[];
  constructor(
    private appInitializer: AppInitializerService,
    private httpClient: HttpClient,
  ) { }
  /*------------------------------------ LICENCE --------------------------------------*/
  /**************************************************************************
   * @description Get all Licences types order by level
   * @return Selected licence
   *************************************************************************/
  getLicencesList(): ILicenceModel[] {
    return this.appInitializer.licencesList
      .filter((res) => new Date(res.licence_start_date) <= new Date() &&
        new Date(res.licence_end_date) >= new Date())
      .sort(
      (a, b) => {
        if (a.level < b.level) {
          return -1;
        }
        if (a.level > b.level) {
          return 1;
        }
        return 0;
      }
    );
  }

  /**************************************************************************
   * @param licence code
   * @description get licence by code
   * @return licence
   *************************************************************************/
  getLicenceByCode(licenceCode: string): ILicenceModel {
    return this.getLicencesList().find(
      (res) => res.LicenceKey.licence_code === licenceCode
    );
  }
  /*------------------------------------ LICENCE FEATURES --------------------------------------*/
  /**************************************************************************
   * @description get all licence
   * @return licence
   *************************************************************************/
  getLicencesFeatures(): Observable<ILicenceFeatureModel[]> {
    return  this.httpClient.get<ILicenceFeatureModel[]>(environment.licenceFeaturesApiUrl);
  }
}
