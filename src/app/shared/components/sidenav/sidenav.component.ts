import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';

import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';

import {
  accordionAnimation,
  buttonAnimation,
  iconAnimation,
  labelAnimation,
  listAnimation,
  nameAnimation,
  sidebarAnimation,
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
    buttonAnimation(),
    accordionAnimation(),
    listAnimation(),
  ]
})
export class SidenavComponent implements OnInit, OnChanges, OnDestroy {

  sidebarState: string;
  icontoShow = 'keyboard_arrow_left';
  company: string;
  iconBool = true;
  pathName: string;
  menu: IMenu[];
  subMenu: IChildItem[] = [];
  parentMenu: string;
  year: number;
  image: string;
  email: string;
  hideTheme: boolean;
  currentUrl: string;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**************************************************************************
   * @description Module Name
   *************************************************************************/
  moduleName: string;
  index: number;
  expand = false;
  constructor(private sidenavService: SidenavService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private utilService: UtilsService,
              private router: Router,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnChanges() {
    this.menu = this.sidenavService.getMenu(this.moduleName);
  }

  ngOnInit() {
    this.sidenavService.hideTheme$.subscribe((data) => this.hideTheme = data);
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred[ 'email_address'];
    this.getModuleName();
    this.getConnectedUser();
    this.getLogo();
    this.getState();
    this.year = new Date().getFullYear();
    this.checkCurrentRoute();
}

  /**************************************************************************
   * @description get connected user
   *************************************************************************/
  getConnectedUser(): void {
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

  /**************************************************************************
   * @description get module name
   *************************************************************************/
  getModuleName(): void {
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
  }

  /**************************************************************************
   * @description get logo
   *************************************************************************/
  getLogo(): void {
    const color = this.localStorageService.getItem(this.utilService.hashCode(this.email));
    if (color === 'whiteGreen' || color === 'whiteOrange' || color === 'whiteRed') {
      this.image = 'assets/img/logo-title-dark.png';
    } else {
      this.image = 'assets/img/logo-title.png';
    }
    this.userService.colorSubject$.subscribe((col) => {
      this.image = col;
    });
  }

  /**************************************************************************
   * @description get state
   *************************************************************************/
  getState(): void {
    this.sidenavService.sidebarStateObservable$.
    subscribe((newState: string) => {
      this.sidebarState = newState;
    }, (err) => {
      console.error(err); });
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

  companyName(): string {
    let comp = this.company;
    if ((this.sidebarState === 'open' && comp.length > 12) || this.sidebarState === 'close') {
      comp = this.company.match(/\b(\w)/g).join('');
    }
    return comp;
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  expandExpansion(pointIndex: number) {
    return pointIndex === this.index;
  }
  checkCurrentRoute() {
    if (`/${this.moduleName}` !== this.currentUrl) {
      this.menu.forEach( (oneMenu) => {
        if (oneMenu.children) {
          oneMenu.children.forEach((child, index) => {
            if (`/${this.moduleName}/${oneMenu.state}/${child.state}` === this.currentUrl) {
              this.toggleSubMenu(oneMenu.children, oneMenu.state);
            } else if (child.child) {
              child.child.forEach((childOfChild) => {
                if (`/${this.moduleName}/${oneMenu.state}/${child.state}/${childOfChild.state}` === this.currentUrl) {
                  this.toggleSubMenu(oneMenu.children, oneMenu.state);
                  this.index = index;
                }
              });
            }
          });
        }
      });
    }
  }
}
