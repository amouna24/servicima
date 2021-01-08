import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {
  Router
} from '@angular/router';
import { SpinnerService } from '@core/services/spinner/spinner.service';

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
    @Inject(DOCUMENT) private document: Document,
    private spinnerService: SpinnerService,
  ) {
    this.spinnerService.isLoadingAction$.subscribe(
      (res) => {
        this.isSpinnerVisible = res;
      }
    );
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
  }
}
