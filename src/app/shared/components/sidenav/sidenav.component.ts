import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { UserService } from '@core/services/user/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  buttonAnimation,
  iconAnimation,
  labelAnimation,
  nameAnimation,
  sidebarAnimation,
} from '../../animations/animations';
import { IMenu } from '../../models/side-nav-menu/side-nav-menu.model';

@Component({
  selector: 'wid-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    sidebarAnimation(),
    iconAnimation(),
    labelAnimation(),
    nameAnimation(),
    buttonAnimation(),
  ]
})
export class SidenavComponent implements OnInit, OnChanges, OnDestroy {

  sidebarState: string;
  panelOpenState = false;
  icontoShow = 'add';
  company: string;
  iconBool = true;
  pathName: string;
  menu: IMenu[];
  subMenu: IChildItem[] = [];
  parentMenu: string;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**************************************************************************
   * @description Module Name
   *************************************************************************/
  moduleName: string;

  constructor(private sidenavService: SidenavService,
              private userService: UserService
  ) {
    this.userService.moduleName$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (moduleName) => {
          if (!!moduleName) {
            this.moduleName = moduleName;
            this.menu = this.sidenavService.getMenu(moduleName);
          }
        },
        (err) => {
          console.error(err);
        });
      this.userService.connectedUser$
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (info) => {
              if (!!info) {
                this.company = info['company'][0]['company_name'];
              }
         },
          (err) => {
                console.error(err);
        });
  }

  ngOnChanges() {
    this.menu = this.sidenavService.getMenu(this.moduleName);
  }

  ngOnInit() {
    this.sidenavService.sidebarStateObservable$.
      subscribe((newState: string) => {
        this.sidebarState = newState;
      }, (err) => {
        console.error(err); });
    this.panelOpenState = true;
  }

  toggleSideNav() {
    this.sidenavService.toggle();
    this.iconBool = !this.iconBool;
    this.iconBool ? this.icontoShow = 'add' : this.icontoShow = 'more_vert';
  }

  toggleSubMenu(submenu: IChildItem[], parentMenu: string) {
    this.subMenu = submenu;
    this.parentMenu = parentMenu;
  }

  closeSubMenu() {
    this.subMenu = [];
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
