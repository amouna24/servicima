import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { UserService } from '@core/services/user/user.service';
import { AuthService, FingerPrintService } from '@widigital-group/auth-npm-front';

import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ThemeService } from '@core/services/themes/theme.service';

import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { sidenavRightMenu } from '@shared/statics/right-sidenav-menu.static';
import { ITheme } from '@shared/models/theme.model';
import { userType } from '@shared/models/userProfileType.model';
import { IUserModel } from '@shared/models/user.model';

// import { AuthService, FingerPrintService } from '../../../../../projects/auth-front-lib/src/public-api';

import {
  accordionAnimation,
  buttonAnimation,
  iconAnimation,
  labelAnimation, listAnimation,
  nameAnimation,
  sidebarAnimation
} from '@shared/animations/animations';
import { UploadService } from '@core/services/upload/upload.service';
@Component({
  selector: 'wid-right-sidenave',
  templateUrl: './right-sidenave.component.html',
  styleUrls: ['./right-sidenave.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
export class RightSidenaveComponent implements OnInit, OnDestroy {

  sidebarState: string;
  user: IUserModel;
  avatar: any;
  haveImage: any;
  moduleName: string;
  menu = [];
  subMenu: IChildItem[] = [];
  parentMenu: string;
  profileUserType = userType.UT_USER;
  firstClick: boolean;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  listColor: ITheme[];
  email: string;
  hideTheme: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private localStorageService: LocalStorageService,
    private utilService: UtilsService,
    private themeService: ThemeService,
    private uploadService: UploadService,
    private fingerPrintService: FingerPrintService,

  ) {
    this.menu = sidenavRightMenu;
  }

  toggleSubMenu(submenu: IChildItem[], parentMenu: string) {
    this.subMenu = submenu;
    this.parentMenu = parentMenu;
  }
  closeSubMenu() {
    this.subMenu = [];
  }
  ngOnInit(): void {
    this.sidenavService.hideTheme$.subscribe((data) => {
      this.hideTheme = data;
    });

   this.getModuleName();
   this.getSelectedTheme();
   this.listColor = this.themeService.listColor;
   this.getStateSidenav();
    this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.user = data['user'][0];
        this.haveImage = data['user'][0]['photo'];
        this.uploadService.imageSubject$.subscribe((datas) => {
          this.haveImage = datas ? datas : data['user'][0]['photo'];
        });

        if (!this.haveImage) {
          this.userService.haveImage$.subscribe((res) => {
              this.haveImage = res;
            }
          );
        }
      }
    });
    this.userService.avatar$.subscribe(
      avatar => {
        this.avatar = avatar;
      }
    );
  }

  /**
   * @description get module name
   */
  getModuleName() {
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

  /**
   * @description get state sidenav
   */
  getStateSidenav() {
    this.sidenavService.rightSidebarStateObservable$.
    subscribe((newState: string) => {
      this.sidebarState = newState;
    }, (err) => {
      console.error(err);
    });
    this.sidenavService.firstClick$.
    subscribe((firstClick: boolean) => {
      this.firstClick = firstClick;
    }, (err) => {
      console.error(err);
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
  /**
   * @description toggle sidenav
   */
  toggleSideNav(): void {
    this.firstClick = true;
    this.sidenavService.toggleRightSideNav();
    this.subMenu = [];
    this.sidenavService.firstClick$.next(false);
  }

  /**
   * @description logout: remove fingerprint and local storage
   * navigate from login
   */
  logout(): void {
    this.fingerPrintService.generateFingerPrint(btoa(this.localStorageService.getItem('userCredentials')['email_address']))
      .then((result) => {
    this.authService.logout(result).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
        this.sidenavService.toggleRightSideNav();
        this.userService.connectedUser$.next(null);
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('currentToken');
        localStorage.removeItem('email_adress');
        // tslint:disable-next-line:no-unused-expression
        localStorage.getItem('linkedin_access_token') ? localStorage.removeItem('linkedin_access_token') : null;
        // tslint:disable-next-line:no-unused-expression
        localStorage.getItem('facebook_access_token') ? localStorage.removeItem('facebook_access_token') : null;
        this.sidenavService.firstClick$.next(false);
        this.router.navigate(['/auth/login']);
      },
      (err) => {
        console.error(err);
      });
      });
  }

  /**
   * @description Display theme
   * @return theme
   */
  displayClass(): any {
    const listStatus = [this.listColor[0].status, this.listColor[1].status, this.listColor[2].status,
      this.listColor[3].status, this.listColor[4].status, this.listColor[5].status,
      this.listColor[6].status];
    if (!Object.values(listStatus).includes(true)) {
      this.listColor[0].status = true;
    }
    this.userService.emitClass({
      'blue': this.listColor[0].status, 'blueBerry': this.listColor[1].status,
      'everGreen': this.listColor[2].status, 'greenBlue': this.listColor[3].status,
      'mango': this.listColor[4].status, 'whiteRed': this.listColor[5].status,
      'setting': this.listColor[6].status
    });
  }

  /**
   * @description Get theme
   * @param color: color
   */
  getTheme(color: string): void {
    this.listColor.map(element => {
      if (element.color !== color) {
        element.status = false;
      } else if (element.status && element.color === color) {
        this.localStorageService.setItem(this.utilService.hashCode(this.email), element.color);
      } else {
        localStorage.removeItem(this.utilService.hashCode(this.email));
      }
    });
    this.displayClass();
    this.displayImage();
  }

  /**
   * @description Display image
   */
  displayImage(): void {
    switch (this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
      case 'whiteRed':
        this.userService.emitColor('assets/img/logo-title-dark.png');
        break;
      default:
        this.userService.emitColor('assets/img/logo-title.png');
    }
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  closeMenu() {
    if (this.firstClick) {
      this.sidenavService.toggleRightSideNav();
      this.subMenu = [];
    }
    }
}
