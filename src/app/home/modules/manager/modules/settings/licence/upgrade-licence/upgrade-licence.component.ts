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
    this.licences = this.licenceService.getLicencesList();
    this.licenceService.getLicencesFeatures().subscribe((data) => {
      this.licencesFeatures = data.filter((res) => res.display);
    });
    this.getAllFeatures();
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
  async getAllFeatures(): Promise<void> {
    await this.featureService.getAllFeatures(this.localStorageService.getItem('language').langCode).subscribe(
      (data) => {
        this.featureList = data;
      }
    );
  }
  getFeatureDesc(licence: ILicenceFeatureModel): IFeatureModel {
   return this.featureList.find(
     (res) => {
       return res.FeatureKey.feature_code === licence.LicenceFeaturesKey.feature_code;
     });
  }
  /**
   * @description back to previous route
   */
  backClicked() {
    this.utilService.previousRoute();
  }
  /**
   * @param licence code
   * @description Display scss background color
   */
  getLicenceFeatures(licence: ILicenceModel): ILicenceFeatureModel[] {
      return this.licencesFeatures.filter((res) => res.LicenceFeaturesKey.licence_code === licence.LicenceKey.licence_code);
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
