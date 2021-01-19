import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { mainContentAnimation } from '@shared/animations/animations';
import { ITheme } from '@shared/models/theme.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { Subject } from 'rxjs';
import { listColor } from '@shared/statics/list-color.static';
import { UtilsService } from '@core/services/utils/utils.service';
@Component({
  selector: 'wid-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  sidebarState: string;
  rightSidebarState: boolean;
  listColor: ITheme[];
  email: string;
  classColor: object;
  isLoading$ = new Subject<boolean>();
  constructor(
    private sidebarService: SidenavService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private utilService: UtilsService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred[ 'email_address'];
    this.listColor = listColor;
    if (this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
      this.listColor.map(element => {
        if (element.color === this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
          element.status = true;
        }
      });
    //  this.displayClass();
    }

    this.displayClass();
    this.userService.isLoadingAction$.subscribe(
      (res) => {
          this.isLoading$.next(res);
      },
      error => this.isLoading$.next(true)
    );
    this.sidebarService.sidebarStateObservable$
      .subscribe((newState: string) => {
        this.sidebarState = newState;
      });
    this.sidebarService.rightSidebarStateObservable$
      .subscribe((newState: string) => {
        this.rightSidebarState = newState === 'open';
      });
  }

  /**
   * @description Display theme
   * @return theme
   */
  displayClass(): void {
    this.classColor =  { 'green': this.listColor[0].status, 'blackYellow': this.listColor[1].status, 'blackGreen': this.listColor[2].status,
      'blueBerry': this.listColor[3].status, 'cobalt': this.listColor[4].status, 'blue': this.listColor[5].status,
      'everGreen': this.listColor[6].status, 'greenBlue': this.listColor[7].status, 'lighterPurple': this.listColor[8].status,
      'mango': this.listColor[9].status, 'whiteGreen': this.listColor[10].status, 'whiteOrange': this.listColor[11].status,
      'whiteRed': this.listColor[12].status
    };
    this.userService.classSubject$.subscribe((col) => {
        this.classColor = col;
      });
  }
}
