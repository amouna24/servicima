import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ITheme } from '@shared/models/theme.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { ThemeService } from '@core/services/themes/theme.service';

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
  listColor: ITheme[];
  email: string;
  lastTheme: string;
  constructor(
    private sidenavService: SidenavService,
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private utilService: UtilsService,
    private themeService: ThemeService,
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
    this.getSelectedTheme();
    this.listColor = this.themeService.listColor;
    this.getTheme('setting');
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
    const activeState = subMenu.some((m) => {
      return currentState.endsWith(m.state); });
    if (activeState) {
      this.subMenu = subMenu;
    } else if (currentState.endsWith('settings')) {
      this.subMenu = this.menu[0].children;
    }
    return activeState;
  }
  /**
   * @description Get theme
   * @param color: color
   */
  getTheme(color): void {
    this.listColor.map(element => {
      this.lastTheme = this.localStorageService.getItem(this.utilService.hashCode(this.email));
      if (element.color !== color) {
        element.status = false;
      } else if (element.color === color) {
        element.status = true;
      } else {
        localStorage.removeItem(this.utilService.hashCode(this.email));
      }
    });
    this.displayClass();
  }

  /**
   * @description Display theme
   * @return theme
   */
  displayClass(): any {
    this.userService.emitClass({ 'green': this.listColor[0].status, 'blackYellow': this.listColor[1].status, 'blackGreen': this.listColor[2].status,
      'blueBerry': this.listColor[3].status, 'cobalt': this.listColor[4].status, 'blue': this.listColor[5].status,
      'everGreen': this.listColor[6].status, 'greenBlue': this.listColor[7].status, 'lighterPurple': this.listColor[8].status,
      'mango': this.listColor[9].status, 'whiteGreen': this.listColor[10].status, 'whiteOrange': this.listColor[11].status,
      'whiteRed': this.listColor[12].status, 'setting': this.listColor[13].status
    });
  }

  /**
   * @description get selected theme
   */
  getSelectedTheme(): void {
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred['email_address'];
    this.listColor = this.themeService.getTheme();
  }
  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.getTheme(this.lastTheme);
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
