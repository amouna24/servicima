import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { mainContentAnimation } from '@shared/animations/animations';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class ManagerComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  sidebarState: string;

  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private sidebarService: SidenavService,
    private userService: UserService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    // this.userService.getUserInfo();
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
