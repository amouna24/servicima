import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable()
export class HttpReqInterceptorService implements HttpInterceptor {
  updatedRequest: any;
  companyId: string;
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // clone http request
    // this.updatedRequest = req.clone({
    //   headers: req.headers.set('Authorization', token)
    // });

    return next.handle(req).pipe(
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
