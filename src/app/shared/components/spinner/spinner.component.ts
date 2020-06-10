import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

@Component({
  selector: 'wid-spinner',
  template: `<div class="preloader" *ngIf="isSpinnerVisible">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
    </div>`,
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = false;

  @Input() public backgroundColor = 'rgba(0, 115, 170, 0.69)';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart || event instanceof GuardsCheckStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
  }
}
