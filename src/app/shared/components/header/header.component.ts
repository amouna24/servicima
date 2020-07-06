import { Component } from '@angular/core';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { UserService } from '@core/services/user/user.service';
import { headerMenu } from '@shared/statics/header-menu.static';
import { IHeaderMenu } from '@shared/models/header-menu/header-menu.model';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';

@Component({
  selector: 'wid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  subMenu: IChildItem[] = [];
  name: string;
  headerMenu: IHeaderMenu[] = headerMenu;

  constructor(private authService: AuthService, private localStorageService: LocalStorageService,
     private router: Router, private userService: UserService) {
    this.userService.connectedUser$.subscribe((userInfo) => {
        if (userInfo) {
          this.name = `${userInfo['user'][0]['first_name']}  ${userInfo['user'][0]['last_name']}`;
        }
      });
     }

  /**
   * @description logout: remove fingerprint and local storage
   * navigate from login
   */
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.localStorageService.clearStorage();
      this.router.navigate(['/auth/login']);
    },
    (err) => {
      console.error(err);
    });
  }

  toggleSubMenu(submenu: IChildItem[]) {
    this.subMenu = submenu;
  }

}
