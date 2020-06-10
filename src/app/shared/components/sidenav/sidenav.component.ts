import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/core/services/sidenav/sidenav.service';

import {
  buttonAnimation,
  iconAnimation,
  labelAnimation,
  nameAnimation,
  sidebarAnimation
} from '../../animations/animations';
import { IMenu } from '../../model/side-nav-menu/side-nav-menu.model';

@Component({
  selector: 'wid-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    sidebarAnimation(),
    iconAnimation(),
    labelAnimation(),
    nameAnimation(),
    buttonAnimation()
  ]
})
export class SidenavComponent implements OnInit, OnChanges {

  sidebarState: string;
  panelOpenState = false;
  pName = '';
  icontoShow = 'add';
  iconBool = true;
  pathName: string;
  menu: IMenu[];
  @Input() moduleName: string;

  constructor(private sidenavService: SidenavService
  ) { }

  ngOnChanges() {
    this.menu = this.sidenavService.getMenu(this.moduleName);
    console.log(this.menu);
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

}
