import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UtilsService } from '@core/services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorReqHandlerService implements ErrorHandler {

  constructor(
    private router: Router,
    private utilService: UtilsService
  ) { }

  handleError(error: any): Observable<never> {
    if (!(error.error instanceof ErrorEvent)) {
      // server-side error
      if (error.error.msg_code) {
        if (this.utilService.getErrorPage(error.error.msg_code)) {
          this.router.navigate(['/error'],
            {
              queryParams: {
                codeError: error.error.msg_code
              }
            });
        }

      } else {
        this.router.navigate(['/error'],
          {
            queryParams: {
              codeError: '500'
            }
          });
      }

    }
    return throwError(error);
  }
}
