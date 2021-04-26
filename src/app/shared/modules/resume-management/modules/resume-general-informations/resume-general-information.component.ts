import { Component, OnInit } from '@angular/core';
import { IUserModel } from '@shared/models/user.model';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { userType } from '@shared/models/userProfileType.model';
import { Subject } from 'rxjs';
import { ITheme } from '@shared/models/theme.model';
import { AuthService } from '@widigital-group/auth-npm-front';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { UserService } from '@core/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { sidenavRightMenu } from '@shared/statics/right-sidenav-menu.static';
import { takeUntil } from 'rxjs/operators';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeModel } from '@shared/models/resume.model';

@Component({
  selector: 'wid-resume-general-information',
  templateUrl: './resume-general-information.component.html',
  styleUrls: ['./resume-general-information.component.scss']
})
export class ResumeGeneralInformationComponent implements OnInit {

  sidebarState: string;
  CreationForm: FormGroup ;
  user: IUserModel;
  avatar: any;
  haveImage: any;
  moduleName: string;
  menu = [];
  subMenu: IChildItem[] = [];
  parentMenu: string;
  profileUserType = userType.UT_RESUME;
  generalInfo: IResumeModel;
  firstname: string = this.userService.connectedUser$.getValue().user[0]['first_name'];
  lastname: string = this.userService.connectedUser$.getValue().user[0]['last_name'];
  company: string = this.userService.connectedUser$.getValue().user[0]['company_email'];

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  listColor: ITheme[];
  email: string;
  showYears = false;
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private localStorageService: LocalStorageService,
    private utilService: UtilsService,
  ) {
    this.menu = sidenavRightMenu;
  }
showHideYears() {
    this.showYears = !this.showYears;
}
  toggleSubMenu(submenu: IChildItem[], parentMenu: string) {
    this.subMenu = submenu;
    this.parentMenu = parentMenu;
  }
  closeSubMenu() {
    this.subMenu = [];
  }
  ngOnInit(): void {
    this.createForm();
    this.getModuleName();
    this.getSelectedTheme();
    this.listColor = this.utilService.listColor;
    this.getStateSidenav();
    this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.user = data['user'][0];
        this.haveImage = data['user'][0]['photo'];
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
   * @description Create Form
   */
  createForm() {
    this.CreationForm = this.fb.group({
      application_id : this.localStorageService.getItem('userCredentials').application_id,
      email_address : this.localStorageService.getItem('userCredentials').email_address,
      company_email : this.company,
      resume_code : `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES`,
      language_id: '',
      years_of_experience : null,
      actual_job : '',
      image : this.avatar,
      init_name : '',
      status : 'A'
});
  }

  /**
   * @description Create Resume
   */
  createResume() {
this.generalInfo = this.CreationForm.value;
this.generalInfo.image = this.avatar.toString();
    if (this.CreationForm.valid) {
      console.log(this.CreationForm.value);
      this.resumeService.addResume(this.generalInfo).subscribe(data => console.log('Resume =', data));
    } else { console.log('Form is not valid');
    }
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
  }

  /**
   * @description get selected theme
   */
  getSelectedTheme(): void {
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred['email_address'];
    this.listColor = this.utilService.getTheme();
  }
  /**
   * @description toggle sidenav
   */
  toggleSideNav(): void {
    this.sidenavService.toggleRightSideNav();
    this.subMenu = [];
  }

  /**
   * @description logout: remove fingerprint and local storage
   * navigate from login
   */
  logout(): void {
    this.authService.logout().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
        this.sidenavService.toggleRightSideNav();
        this.userService.connectedUser$.next(null);
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('currentToken');
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
}
