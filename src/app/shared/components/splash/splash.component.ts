import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';

@Component({
  selector: 'wid-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashComponent implements OnInit, OnDestroy {
  public isSpinnerVisible = false;
  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
  ) {

  }
  ngOnInit(): void {
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
