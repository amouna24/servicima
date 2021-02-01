import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { UserService } from '@core/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadService } from '@core/services/upload/upload.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { indicate } from '@core/services/utils/progress';
import { IUserModel } from '@shared/models/user.model';
import { Subject } from 'rxjs';
import { AuthService } from '@widigital-group/auth-npm-front';
import { ProfileService } from '@core/services/profile/profile.service';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { sidenavRightMenu } from '@shared/statics/right-sidenav-menu.static';
import {
  accordionAnimation,
  buttonAnimation,
  iconAnimation,
  labelAnimation, listAnimation,
  nameAnimation,
  sidebarAnimation
} from '@shared/animations/animations';
import { ITheme } from '@shared/models/theme.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { listColor } from '@shared/statics/list-color.static';
import { takeUntil } from 'rxjs/operators';
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
  selectedFile = { file: null, name: '' };
  loading$ = new Subject<boolean>();
  moduleName: string;
  menu = [];
  subMenu: IChildItem[] = [];
  parentMenu: string;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  listColor: ITheme[];
  email: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private userService: UserService,
    private uploadService: UploadService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private localStorageService: LocalStorageService,
    private utilService: UtilsService,
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
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred[ 'email_address'];
    this.listColor = listColor;
    if (this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
      this.listColor.map(element => {
        if (element.color === this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
          element.status = true;
        }
      });
    }
    this.sidenavService.rightSidebarStateObservable$.
    subscribe((newState: string) => {
      this.sidebarState = newState;
    }, (err) => {
      console.error(err);
    });
    this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.user = data['user'][0];
      }
    });
    this.userService.avatar$.subscribe(
      avatar => {
        this.avatar = avatar;
      }
    );
  }

  toggleSideNav() {
    this.sidenavService.toggleRightSideNav();
    this.subMenu = [];
  }

  /**
   * @description : set the Image to UpLoad and preview
   */
  previewFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
    const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
    formData.append('file', file);
    formData.append('caption', file.name);
    this.selectedFile.file = formData;
    this.selectedFile.name = file.name;
  }

  /**
   * @description : Upload Image to Server  with async to promise
   */
  async uploadFile() {
    const filename = await this.uploadService.uploadImage(this.selectedFile.file)
      .pipe(
        indicate(this.loading$),
        map(
          response => response.file.filename
        ))
      .toPromise();
    this.user.email_address = this.user.userKey.email_address;
    this.user.application_id = this.user.userKey.application_id;
    this.user.photo = filename;
    this.profileService.updateUser(this.user).subscribe(
      (res) => {
      },
      (error) => {
        console.log(error);
      }
    );
    this.userService.getImage(filename);
    this.selectedFile.file = null;
  }

  /**
   * @description : Clear  preview  Image
   */
  clearPreview() {
    this.selectedFile = null;
    this.avatar = this.userService.avatar$.getValue();
  }

  /**
   * @description logout: remove fingerprint and local storage
   * navigate from login
   */
  logout(): void {
    this.authService.logout().subscribe(() => {
        this.sidenavService.toggleRightSideNav();
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('currentToken');
        this.userService.connectedUser$.next(null);
        this.router.navigate(['/auth/login']);
      },
      (err) => {
        console.error(err);
      });
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
      'whiteRed': this.listColor[12].status
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
   * @param color: color
   */
  displayImage(): void {
    switch (this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
      case 'whiteGreen':
        this.userService.emitColor('assets/img/logo-title-dark.png');
        break;
      case 'whiteOrange':
        this.userService.emitColor('assets/img/logo-title-dark.png');
        break;
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

}
