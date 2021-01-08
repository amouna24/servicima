import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { UserService } from '@core/services/user/user.service';
import { MatExpansionPanel } from '@angular/material/expansion';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import {
  accordionAnimation,
  buttonAnimation,
  iconAnimation,
  labelAnimation,
  listAnimation,
  nameAnimation,
  sidebarAnimation,
} from '../../animations/animations';

import { IMenu } from '../../models/side-nav-menu/side-nav-menu.model';
import { UtilsService } from '@core/services/utils/utils.service';

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
    accordionAnimation(),
    listAnimation(),
  ]
})
export class SidenavComponent implements OnInit, OnChanges, OnDestroy {

  sidebarState: string;
  panelOpenState = false;
  icontoShow = 'keyboard_arrow_left';
  company: string;
  abbrCompany: string;
  iconBool = true;
  pathName: string;
  menu: IMenu[];
  subMenu: IChildItem[] = [];
  parentMenu: string;
  year: number;
  image: string;
  email: string;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**************************************************************************
   * @description Module Name
   *************************************************************************/
  moduleName: string;
  constructor(private sidenavService: SidenavService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private utilService: UtilsService,
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
                this.abbrCompany = this.company.match(/\b(\w)/g).join('');
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
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred[ 'email_address'];
    const color = this.localStorageService.getItem(this.utilService.hashCode(this.email));
    if (color === 'whiteGreen' || color === 'whiteOrange' || color === 'whiteRed') {
      this.image = 'assets/img/logo-title-dark.png';
    } else {
      this.image = 'assets/img/logo-title.png';
    }
    this.sidenavService.sidebarStateObservable$.
      subscribe((newState: string) => {
        this.sidebarState = newState;
      }, (err) => {
        console.error(err); });
    this.panelOpenState = true;
    this.userService.colorSubject$.subscribe((col) => {
      this.image = col;
    });
    this.year = new Date().getFullYear();
  }

  toggleSideNav() {
    this.sidenavService.toggle();
    this.iconBool = !this.iconBool;
    this.iconBool ? this.icontoShow = 'keyboard_arrow_left' : this.icontoShow = 'keyboard_arrow_right';
  }

  toggleSubMenu(submenu: IChildItem[], parentMenu: string) {
    this.subMenu = submenu;
    this.parentMenu = parentMenu;
  }

  toggleAccordion(widExp: MatExpansionPanel) {
    if (this.sidebarState === 'close') {
      this.toggleSideNav();
      widExp.open();
    }
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
