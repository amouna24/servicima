import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';
import { candidateMenu } from '@shared/statics/candidate-menu.static';
import { collaboraterMenu } from '@shared/statics/collaborater-menu.static';
import { managerMenu } from '@shared/statics/manager-menu.static';
import { ManagerSettingMenu } from '@shared/statics/manager-setting-menu';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidebarState = 'open';
  private sidebarStateChanged$ = new BehaviorSubject<string>(this.sidebarState);
  public sidebarStateObservable$ = this.sidebarStateChanged$.asObservable();

  private rightSidebarState = 'close';
  private rightSidebarStateChanged$ = new BehaviorSubject<string>(this.rightSidebarState);
  public  rightSidebarStateObservable$ = this.rightSidebarStateChanged$.asObservable();

  managerMenu: IMenu[] = managerMenu;
  managerSettingMenu: IMenu[] = ManagerSettingMenu;
  collaboraterMenu: IMenu[] = collaboraterMenu;
  candidateMenu: IMenu[] = candidateMenu;

  constructor() {
    this.sidebarStateChanged$.next('open');
    this.rightSidebarStateChanged$.next('close');
  }

  toggle() {
    this.sidebarState = this.sidebarState === 'open' ? 'close' : 'open';
    this.sidebarStateChanged$.next(this.sidebarState);
  }

  toggleRightSideNav() {
    this.rightSidebarState = this.rightSidebarState === 'open' ? 'close' : 'open';
    this.rightSidebarStateChanged$.next(this.rightSidebarState);
  }

  getState() {
    return this.sidebarState;
  }

  getRightSidenavState() {
    return this.rightSidebarState === 'open';
  }

  getMenu(moduleName: string): IMenu[] {
    switch (moduleName) {
      case 'manager':
        return this.managerMenu;
      case 'managerSetting':
        return this.managerSettingMenu;
      case 'collaborater':
        return this.collaboraterMenu;
      case 'candidate':
        return this.candidateMenu;
    }
  }
}
