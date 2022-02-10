import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import * as _ from 'lodash';

@Directive({
  selector: '[cantBeDisplayed]'
})
export class CantBeDisplayedDirective implements OnInit {

  private currentUser: any; // todo: use the right type when ready
  feature: string;
  availableFeature = [];
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
    this.availableFeature = _.intersection(this.userService.licenceFeature, this.userService.companyRolesFeatures[0]);
    this.currentUser = {
      features: this.availableFeature
    };
    this.updateView();
  }
  @Input()
  set cantBeDisplayed(params: any) {
    if (params) {
      this.feature = params.feature;
    }
  }
  /**
   * Insert or remove the html element from the DOM
   */
  updateView() {
    if (!this.isDisplayed()) {
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
    if (!this.userService.licenceFeature.includes(this.feature)) {
      return false;
    }
    return this.currentUser &&
      this.currentUser.features &&
      this.currentUser.features.includes(this.feature);
  }

}
