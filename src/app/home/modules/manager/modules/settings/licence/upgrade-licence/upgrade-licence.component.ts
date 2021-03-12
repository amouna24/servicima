import { Component, OnInit } from '@angular/core';
import { ILicenceModel } from '@shared/models/licence.model';
import { Router } from '@angular/router';
import { LicenceService } from '@core/services/licence/licence.service';
import { ILicenceFeatureModel } from '@shared/models/licenceFeature.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'wid-upgrade-licence',
  templateUrl: './upgrade-licence.component.html',
  styleUrls: ['./upgrade-licence.component.scss']
})
export class UpgradeLicenceComponent implements OnInit {
  licences: ILicenceModel[];
  features: ILicenceFeatureModel[];
  constructor( private licenceService: LicenceService,
               private router: Router) { }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.licences = this.licenceService.getLicencesList();
    await this.licenceService.getLicencesFeatures()
      .pipe(
        take(3),
      ).subscribe((data) => {
      this.features = data;
    });
  }
  /**
   * @param Licence code
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
   * @param Licence code
   * @description Display scss background color
   */
  getLicenceFeatures(licence: ILicenceModel): ILicenceFeatureModel[] {
      return this.features.filter((res) => res.LicenceFeaturesKey.licence_code === licence.LicenceKey.licence_code);
  }
  /**
   * @param Licence code
   * @param Pack (monthly or annual)
   * @description Navigate to buy licence page
   */
  buyLicence(code: string, billing: string): void {
    this.router.navigate(['/manager/settings/licences/buy-licence'],
      {
        queryParams: {
          licence : code,
          pack: billing
        }
      });
  }

}
