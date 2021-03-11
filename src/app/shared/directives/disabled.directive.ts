import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import * as _ from 'lodash';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective implements OnInit , AfterViewInit {
  private currentUser: any; // todo: use the right type when ready
  feature: string;
  availableFeature = [];
  validator: boolean;
  constructor(
    private element: ElementRef,
    private userService: UserService,
  ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit() {
    this.getUserConnected();
  }

  /**
   * @description update view
   */
  ngAfterViewInit() {
   this.updateView();
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
  }
  @Input()
  set disableControl(params: any) {
    if (params && params.validator === undefined) {
      this.feature = params.feature;
      this.validator = true;
    } else if (params) {
      this.feature = params.feature;
      this.validator = params.validator;
    }
    this.updateView();
  }
  /**
   * Disabled or active the html element from the DOM
   */
  updateView() {
    if (this.isDisplayed() && this.validator) {
      this.element.nativeElement.disabled = false;
    } else {
      this.element.nativeElement.disabled = true;
    }
  }

  /**
   * if the HTML element can be disabled or not depending on the connected user
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
