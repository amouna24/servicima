import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenu } from 'src/app/shared/model/side-nav-menu/side-nav-menu.model';
import { candidateMenu } from 'src/app/shared/static/candidate-menu.static';
import { collaboraterMenu } from 'src/app/shared/static/collaborater-menu.static';
import { managerMenu } from 'src/app/shared/static/manager-menu.static';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidebarState = 'open';
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
