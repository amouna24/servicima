import { Component, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';

import {
  buttonAnimation,
  iconAnimation,
  labelAnimation,
  nameAnimation,
  sidebarAnimation
} from '../../animations/animations';

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
export class SidenavComponent implements OnInit {

  title = 'mainProject';
  sidebarState: string;
  panelOpenState = false;
  pName = '';
  icontoShow = 'add';
  iconBool = true;
  pathName: string;
  constructor(private sidenavService: SidenavService
             ) { }

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
    this.iconBool  ? this.icontoShow = 'add' : this.icontoShow = 'more_vert';
  }

}
