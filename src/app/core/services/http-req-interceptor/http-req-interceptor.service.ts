import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';


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
