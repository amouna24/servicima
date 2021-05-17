import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingAction$ = this.isLoadingSubject.asObservable();

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart || event instanceof GuardsCheckStart) {
          this.isLoadingSubject.next(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          if (this.userService.refresh === undefined && !router.url.startsWith('/auth')) {
            this.isLoadingSubject.next(true);
          } else {
            this.isLoadingSubject.next(false);
          }

        }
      },
      () => {
        this.isLoadingSubject.next(false);
      }
    );
  }
}
