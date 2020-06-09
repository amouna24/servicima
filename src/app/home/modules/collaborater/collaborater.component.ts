import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { SidenavService } from '../../../core/services/sidenav/sidenav.service';
import { mainContentAnimation } from '../../../shared/animations/animations';

@Component({
  selector: 'wid-collaborater',
  templateUrl: './collaborater.component.html',
  styleUrls: ['./collaborater.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class CollaboraterComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  sidebarState: string;

  private mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private sidebarService: SidenavService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }
  toggle() {
    this.sidebarService.toggle();
  }

  ngOnInit() {
    this.sidebarService.sidebarStateObservable$
      .subscribe((newState: string) => {
        this.sidebarState = newState;
      });
  }

}
