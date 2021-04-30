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

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingAction$ = this.isLoadingSubject.asObservable();

  constructor(
    private router: Router,
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
          if (this.router.url === '/manager' ||
            this.router.url === '/collaborator' ||
            this.router.url === '/candidate' ||
            this.router.url === '/') {
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
