import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { UserService } from '@core/services/user/user.service';

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
export class SidenavComponent implements OnInit, OnChanges {

  sidebarState: string;
  panelOpenState = false;
  icontoShow = 'add';
  company: string;
  iconBool = true;
  pathName: string;
  menu: IMenu[];
  subMenu: IChildItem[] = [];
  @Input() moduleName: string;

  constructor(private sidenavService: SidenavService, private userService: UserService
  ) {
    this.userService.company$.subscribe((data) => {
     this.company = data['company_name'];
    });
  }

  ngOnChanges() {
    this.menu = this.sidenavService.getMenu(this.moduleName);
  }

  ngOnInit() {
    this.sidenavService.sidebarStateObservable$.
      subscribe((newState: string) => {
        this.sidebarState = newState;
      });
    this.panelOpenState = true;
  }

  toggleSideNav() {
    this.sidenavService.toggle();
    this.iconBool = !this.iconBool;
    this.iconBool ? this.icontoShow = 'add' : this.icontoShow = 'more_vert';
  }

  toggleSubMenu(submenu: IChildItem[]) {
    this.subMenu = submenu;
  }

  closeSubMenu() {
    this.subMenu = [];
  }

}
