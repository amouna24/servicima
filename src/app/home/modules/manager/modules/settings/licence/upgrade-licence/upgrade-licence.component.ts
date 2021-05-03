import { Component, OnInit } from '@angular/core';
import { ILicenceModel } from '@shared/models/licence.model';
import { Router } from '@angular/router';
import { LicenceService } from '@core/services/licence/licence.service';
import { ILicenceFeatureModel } from '@shared/models/licenceFeature.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { FeatureService } from '@core/services/feature/feature.service';
import { IFeatureModel } from '@shared/models/feature.model';

@Component({
  selector: 'wid-upgrade-licence',
  templateUrl: './upgrade-licence.component.html',
  styleUrls: ['./upgrade-licence.component.scss']
})
export class UpgradeLicenceComponent implements OnInit {
  licences: ILicenceModel[];
  licence: ILicenceModel;
  licencesFeatures: ILicenceFeatureModel[];
  constructor( private licenceService: LicenceService,
               private featureService: FeatureService,
               private router: Router) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit(): Promise<void> {
    this.getLicences();
    this.licence = this.licences[0];
    this.getLicencesFeatures();

  }
  /**
   * @description Get licence Feature
   */
  getLicencesFeatures() {
    this.licenceService.getLicencesFeatures().subscribe((data) => {
      this.licencesFeatures = data;
      console.log('licences feature', data);
    });
  }
  /**
   * @description Get licence list
   */
  getLicences() {
    this.licenceService.getLicencesList().subscribe(
      (data) => {
        console.log('Licences', data);
        this.licences = data.sort(
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
  getFeatureDesc(licence: ILicenceFeatureModel): string {
    this.featureService.getFeatureByCode(licence.LicenceFeaturesKey.feature_code).subscribe(
      (data) => {
        console.log(data);
      }
    );
    return licence.LicenceFeaturesKey.feature_code;
  }
  async getFeatureByCode(code: string): Promise<IFeatureModel> {
    let feature: IFeatureModel;
    await this.featureService.getFeatureByCode(code)
      .subscribe(
        (data) => { feature = data[0]; }
      );
    return feature;
  }
  /**
   * @param licence code
   * @description Display scss background color
   */
  getLicenceFeatures(licence: ILicenceModel): ILicenceFeatureModel[] {
    return this.licencesFeatures.filter(
      (f) => f.LicenceFeaturesKey.licence_code === licence.LicenceKey.licence_code
    );
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
