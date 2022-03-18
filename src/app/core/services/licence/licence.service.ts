import { Injectable } from '@angular/core';
import { ILicenceModel } from '@shared/models/licence.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { HttpClient } from '@angular/common/http';
import { ILicenceFeatureModel } from '@shared/models/licenceFeature.model';
import { ICompanyLicenceModel } from '@shared/models/companyLicence.model';
import { Observable } from 'rxjs';

import { environment } from '@environment/environment';

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
  getLicencesList(): Observable<ILicenceModel[]> {
    return this.httpClient.get<ILicenceModel[]>(environment.licenceApiUrl);
  }

  /**************************************************************************
   * @description get licence by code
   * @return licence
   * @param licenceCode
   *************************************************************************/
  getLicenceByCode(licenceCode: string): Observable<ILicenceModel[]> {
    return this.httpClient.get<ILicenceModel[]>(environment.licenceApiUrl + '?licence_code=' + licenceCode);
  }
  /*------------------------------------ LICENCE FEATURES --------------------------------------*/
  /**************************************************************************
   * @description get all licence
   * @return licence
   *************************************************************************/
  getLicencesFeaturesByCode(licenceCode: string): Observable<ILicenceFeatureModel[]> {
    return  this.httpClient
      .get<ILicenceFeatureModel[]>(environment.licenceFeaturesApiUrl + '?licence_code=' + licenceCode + '&display=' + true );
  }

  /*------------------------------------ COMPANY LICENCE --------------------------------------*/
  /**************************************************************************
   * @description Update licence company
   * @return licence
   *************************************************************************/
  updateCompanyLicence(companyLicence: any): Observable<ICompanyLicenceModel> {
    return this.httpClient.put<ICompanyLicenceModel>(environment.companyLicenceApiUrl , companyLicence);
  }

  /*------------------------------------ COMPANY LICENCE --------------------------------------*/
  /**************************************************************************
   * @description Add licence company
   * @return licence
   *************************************************************************/
  addCompanyLicence(companyLicence: any): Observable<ICompanyLicenceModel> {
    return this.httpClient.post<ICompanyLicenceModel>(environment.companyLicenceApiUrl , companyLicence);
  }
  /**************************************************************************
   * @description Disable
   * @return licence
   *************************************************************************/
  disableCompanyLicence(id: string): Observable<ICompanyLicenceModel> {
    return this.httpClient.delete<ICompanyLicenceModel>(
      environment.companyLicenceApiUrl + '/disable?_id=' + id );
  }
  /**************************************************************************
   * @description Get company licence
   * @returns All company licence <list>
   *************************************************************************/
  getCompanyLicence(filter: string): Observable<ICompanyLicenceModel[]> {
    return this.httpClient.get<ICompanyLicenceModel[]>(`${environment.companyLicenceApiUrl}/${filter}`);
  }
}
