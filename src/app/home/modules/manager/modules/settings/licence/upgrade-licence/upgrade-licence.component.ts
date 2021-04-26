import { Component, OnInit } from '@angular/core';
import { ILicenceModel } from '@shared/models/licence.model';
import { Router } from '@angular/router';
import { LicenceService } from '@core/services/licence/licence.service';
import { ILicenceFeatureModel } from '@shared/models/licenceFeature.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { FeatureService } from '@core/services/feature/feature.service';
import { IFeatureModel } from '@shared/models/feature.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-upgrade-licence',
  templateUrl: './upgrade-licence.component.html',
  styleUrls: ['./upgrade-licence.component.scss']
})
export class UpgradeLicenceComponent implements OnInit {
  licences: ILicenceModel[];
  licencesFeatures: ILicenceFeatureModel[];
  featureList: IFeatureModel[];
  constructor( private licenceService: LicenceService,
               private router: Router,
               private utilService: UtilsService,
               private localStorageService: LocalStorageService,
               private featureService: FeatureService) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit(): Promise<void> {
    this.getLicences().then(
      () => {
        this.getLicencesFeatures().then(
          () => this.licencesFeatures = this.licencesFeatures.filter((res) => res.display)
        );
      }
    );
  }
  /**
   * @description Get licence Feature
   */
  async getLicencesFeatures(): Promise<void> {
    await this.licenceService.getLicencesFeatures().subscribe((data) => {
      this.licencesFeatures = data;
    });
  }
  /**
   * @description Get licence list
   */
  async getLicences(): Promise<void> {
    await this.licenceService.getLicencesList().subscribe(
      (data) => {
        this.licences = data.filter((res) =>
          new Date(res.licence_start_date) <= new Date() &&
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
    );
  }
  /**
   * @param name licence code
   * @description Display scss background color
   */
  displayClass(name: string): string {
    switch (name) {
      case 'BASIC': {
        return 'bg-topaz';
      }
      case 'PREMIUM': {
        return 'bg-pale-gold';
      }
      default: {
        return 'bg-purpley';
      }
    }
  }
  /**
   * @description get All features
   */
  getFeatureDesc(licence: ILicenceFeatureModel): IFeatureModel {
   return this.featureList.find(
     (res) => {
       return res.FeatureKey.feature_code === licence.LicenceFeaturesKey.feature_code;
     });
  }
  /**
   * @param licence code
   * @description Display scss background color
   */
  getLicenceFeatures(licence: ILicenceModel): ILicenceFeatureModel[] {
    let licenceFeature: ILicenceFeatureModel[] ;
      this.licenceService.getLicencesFeaturesByCode(licence.LicenceKey.licence_code).subscribe(
        (data) => {
          licenceFeature = data;
        }
      );
      return licenceFeature;
  }
  /**
   * @param code licence code
   * @param billing (monthly or annual)
   * @description Navigate to buy licence page
   */
  buyLicence(code: string, billing: string): void {
    this.router.navigate([
      '/manager/settings/licences/buy-licence',
      code,
      billing
    ]);
  }

}
