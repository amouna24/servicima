import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';
import { candidateMenu } from '@shared/statics/candidate-menu.static';
import { collaboraterMenu } from '@shared/statics/collaborater-menu.static';
import { managerMenu } from '@shared/statics/manager-menu.static';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidebarState = 'open';
  private sidebarState1 = 'close';
  private sidebarStateChanged$ = new BehaviorSubject<string>(this.sidebarState);
  public sidebarStateObservable$ = this.sidebarStateChanged$.asObservable();

  managerMenu: IMenu[] = managerMenu;
  collaboraterMenu: IMenu[] = collaboraterMenu;
  candidateMenu: IMenu[] = candidateMenu;

  constructor() {
    this.sidebarStateChanged$.next('open');
  }

  toggle() {
    this.sidebarState = this.sidebarState === 'open' ? 'close' : 'open';
    this.sidebarStateChanged$.next(this.sidebarState);
  }
  toggle1() {
    this.sidebarState1 = this.sidebarState1 === 'open' ? 'close' : 'open';
    this.sidebarStateChanged$.next(this.sidebarState1);
  }

  getState() {
    return this.sidebarState;
  }

  getMenu(moduleName: string): IMenu[] {
    switch (moduleName) {
      case 'manager':
        return this.managerMenu;
      case 'collaborater':
        return this.collaboraterMenu;
      case 'candidate':
        return this.candidateMenu;
    }
  }
}
