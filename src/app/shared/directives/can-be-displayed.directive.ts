import {Directive, ElementRef, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[canBeDisplayed]'
})
export class CanBeDisplayedDirective implements OnDestroy {
  private subscribe: Subscription;
  private currentUser: any; // todo: use the right type when ready
  feature: string;
  license: string;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {

    /**
     * todo: Subscribe to the current User to get needed data
     */
    // Add a BehaviorSubject to emit the user object on authentication
    // than subscribe to it here
    // get the current user
    this.currentUser = {
      license: '123456',
      features: ['dashboard', 'outsoursing', 'bills', 'HR', 'contracts', 'administration', 'timesheet']
    };
  }

  @Input()
  set canBeDisplayed(params) {
    this.feature = params.feature;
    this.license = params.license;
    this.updateView();
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
    this.subscribe.unsubscribe();
  }
}
