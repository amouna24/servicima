import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { mainContentAnimation } from '../../../../shared/animations/animations';
import { environment } from 'src/environments/environment';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidenavService } from 'src/app/core/services/sidenav/sidenav.service';

@Component({
  selector: 'wid-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class ManagerComponent implements OnInit, OnDestroy {

  title = 'WIDIGITAL ' + environment.env;

  mobileQuery: MediaQueryList;

  sidebarState: string;

  private mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private sidebarService: SidenavService, ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
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
