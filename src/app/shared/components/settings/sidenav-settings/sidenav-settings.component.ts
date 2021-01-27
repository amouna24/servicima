import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'wid-sidenav-settings',
  templateUrl: './sidenav-settings.component.html',
  styleUrls: ['./sidenav-settings.component.scss'],
})
export class SidenavSettingsComponent implements OnInit, OnDestroy {
  menu: IMenu[];
  subMenu: IChildItem[];
  moduleName: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private sidenavService: SidenavService,
    private userService: UserService) { }

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
  }

  getSubMenu(subMenu: IChildItem[]): void {
    this.subMenu = subMenu;
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
