import { Directive, ElementRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';

@Directive({
  selector: '[canBeDisplayed]'
})
export class CanBeDisplayedDirective implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private currentUser: any; // todo: use the right type when ready
  feature: string;
  license: string;
  licenseUser: string;
  licenceFeature: string[] = [];
  companyrolesfeatures: string[] = [];

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
  ) {
  }
    /**
     * todo: Subscribe to the current User to get needed data
     */
    // Add a BehaviorSubject to emit the user object on authentication
    // than subscribe to it here
    // get the current user
    getUserConnected(): void {
      this.subscriptions.push(this.userService.connectedUser$.subscribe((data) => {
          if (!!data) {
            this.licenceFeature = data['licencefeatures'].map(element => element['LicenceFeaturesKey']['feature_code']);
            console.log(this.licenceFeature, 'licence feature');
            this.licenseUser = data['companylicence'][0]['companyLicenceKey']['licence_code'];
            this.currentUser = {
              license: this.licenseUser,
              features: this.licenceFeature
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
        this.license = params.license;
        this.getUserConnected();
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
        this.currentUser.license &&
        this.currentUser.features.includes(this.feature);
    }

    ngOnDestroy() {
      this.subscriptions.forEach((subscription => subscription.unsubscribe()));
    }

  }
