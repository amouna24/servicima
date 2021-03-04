import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorReqHandlerService } from '@core/services/http-error-req-handler/http-error-req-handler.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { LocalStorageService } from '../storage/local-storage.service';

@Injectable()
export class HttpReqInterceptorService implements HttpInterceptor {
  updatedRequest: any;
  token: string;
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private httpErrorHandler: HttpErrorReqHandlerService
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.localStorageService.getItem('currentToken')) {
      this.token =  this.localStorageService.getItem('currentToken').account_activation_token;
    }
    this.updatedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.token}`)
    });
    return next.handle(this.updatedRequest).pipe(
      catchError((error: HttpErrorResponse) =>
        this.httpErrorHandler.handleError(error)
      )
    );

  }
}
