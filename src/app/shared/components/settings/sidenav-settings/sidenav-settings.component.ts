import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-sidenav-settings',
  templateUrl: './sidenav-settings.component.html',
  styleUrls: ['./sidenav-settings.component.scss']
})
export class SidenavSettingsComponent implements OnInit, OnDestroy {
  menu: IMenu[];
  subMenu: IChildItem[];
  moduleName: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private sidenavService: SidenavService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.menu = this.sidenavService.getMenu('managerSetting');
    this.userService.moduleName$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (moduleName) => {
          this.moduleName = moduleName;
        },
        (err) => {
          console.error(err);
        });
    // Get the current submenu
    this.menu.forEach( el => this.currentState(el.children));
  }
  /**
   * @description display the child menu
   */
  getSubMenu(subMenu: IChildItem[]): void {
    this.subMenu = subMenu;
  }
  /**
   * @description check if the submenu contain the current state
   * @return boolean
   */
  currentState(subMenu: IChildItem[]): boolean {
    const currentState: string = this.router.url;
    // tslint:disable-next-line:only-arrow-functions
    const activeState = subMenu.some(function(m) {
      return currentState.endsWith(m.state); });
    if (activeState) {
      this.subMenu = subMenu;
    }
    return activeState;
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
