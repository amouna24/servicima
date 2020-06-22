import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpReqInterceptorService implements HttpInterceptor {
  updatedRequest: any;
  // TODO : get the user token from the storage
  userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaW1lbi5hbW1hckB3aWRpZ2l0YWwtZ3JvdXAuY29tIiwiaWF0I'
    + 'joxNTkyNTU2MDExLCJleHAiOjE1OTI2NDI0MTF9.YqWEZVsDs9C9mMiGMsqRzVSrQX4lgCoUptVyIw0ilIQ';
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.updatedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.userToken}`)
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
