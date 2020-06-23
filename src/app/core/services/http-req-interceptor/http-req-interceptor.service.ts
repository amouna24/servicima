import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LocalStorageService } from '../storage/local-storage.service';

@Injectable()
export class HttpReqInterceptorService implements HttpInterceptor {
  updatedRequest: any;
  // TODO : get the user token from the storage
  token: string;
  constructor(private router: Router, private localStorageService: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.localStorageService.getItem('currentToken')) {
      this.token =  this.localStorageService.getItem('currentToken').account_activation_token;
    }
    this.updatedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.token}`)
    });
    return next.handle(this.updatedRequest).pipe(
      tap(
        event => {
        },
        errorResponse => {
          // handle http errors
        }
      )
    );

  }
}
