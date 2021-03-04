import { Directive, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import * as _ from 'lodash';
@Directive({
  selector: '[canBeDisplayed]'
})
export class CanBeDisplayedDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private currentUser: any; // todo: use the right type when ready
  feature: string;
  license: string;
  licenseUser: string;
  availableFeature: string[] = [];
  licenceFeature: string[] = [];
  companyRolesFeatures = [];
  email_address: string;
  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
  ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit() {
    this.getUserConnected();
  }

  /**
   * todo: Subscribe to the current User to get needed data
   */
  // Add a BehaviorSubject to emit the user object on authentication
  // than subscribe to it here
  // get the current user
  getUserConnected() {
    this.subscriptions.push(this.userService.connectedUser$.subscribe(async (data) => {
      if (!!data) {
        this.email_address = data['company'][0]['companyKey']['email_address'];
        const arrayList = await this.userService.listFeatureRole[0];
            this.companyRolesFeatures = [];
            this.companyRolesFeatures.push(Object.values(arrayList).map(element => element['companyRoleFeaturesKey']['feature_code']));
            this.licenceFeature = data['licencefeatures'].map(element => element['LicenceFeaturesKey']['feature_code']);
            this.availableFeature = _.intersection(this.licenceFeature, this.companyRolesFeatures[0]);
            this.currentUser = {
              features: this.availableFeature
            };
          this.updateView();
      }
    },
      (error) => {
        console.log(error);
      }
    ));
  }

  @Input()
  set canBeDisplayed(params: any) {
    if (params) {
      this.feature = params.feature;
    }
  }

  /**
   * Insert or remove the html element from the DOM
   */
  updateView() {
    if (this.isDisplayed()) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  /**
   * if the HTML element can be displayed or not depending on the connected user
   */
  isDisplayed(): boolean {
    return this.currentUser &&
      this.currentUser.features &&
      this.currentUser.features.includes(this.feature);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
