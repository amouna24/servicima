import { Injectable } from '@angular/core';
import { IFeatureModel } from '@shared/models/feature.model';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(private httpClient: HttpClient, ) { }
  /**
   * @description Get all existing features
   * @param language: language
   */
  getAllFeatures(language: string) {
    return this.httpClient
      .get<IFeatureModel[]>(`${environment.featuresApiUrl}?language_id=${language}`);
  }
}
