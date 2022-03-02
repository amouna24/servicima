import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import * as _ from 'lodash';
import { UserService } from '@core/services/user/user.service';

@Directive({
  selector: '[widDisabledForm]'
})
export class DisabledFormDirective implements OnInit {
  private currentUser: any; // todo: use the right type when ready
  availableFeature = [];
  feature: string;
  form: any;

  constructor(   private element: ElementRef,
                 private templateRef: TemplateRef<any>,
                 private viewContainer: ViewContainerRef,
                 private userService: UserService, ) {
  }

  @Input()
   set widDisabledForm(params: any) {
    console.log('paramssssssssssss=', params);
    if (params) {
      this.feature = params.feature;
      this.form = params.form;
      this.updateView(params.feature);
    }
  }

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
    this.updateView(this.feature);
  }

  /**
   * Insert or remove the html element from the DOM
   */
  updateView(feature) {
    console.log('feature =', feature);
    if (!this.isDisplayed(feature)) {
      this.form.disable();
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.form.enable();
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  /**
   * if the HTML element can be displayed or not depending on the connected user
   */
  isDisplayed(feature): boolean {
    if (!this.userService.licenceFeature.includes(feature)) {
      return false;
    }
    return this.currentUser &&
      this.currentUser.features &&
      this.currentUser.features.includes(feature);
  }
}
