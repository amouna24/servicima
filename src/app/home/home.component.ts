import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { mainContentAnimation } from '@shared/animations/animations';

@Component({
  selector: 'wid-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  sidebarState: string;

  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private sidebarService: SidenavService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  ngOnInit() {
    this.sidebarService.sidebarStateObservable$
      .subscribe((newState: string) => {
        this.sidebarState = newState;
      });
  }

}
