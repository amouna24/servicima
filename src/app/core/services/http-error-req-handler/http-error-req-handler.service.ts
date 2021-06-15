import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorReqHandlerService implements ErrorHandler {

  constructor(
    private router: Router,
    private utilService: UtilsService,
    private modalService: ModalService,
  ) { }

  handleError(error: any): Observable<never> {
    if (!(error.error instanceof ErrorEvent)) {
      if (error.error.msg_code) {
        console.log(error.error.msg_code, 'indice');
        if (error.error.msg_code === '0001') {
          const add = {
            code: 'error',
            title: 'Timesheet already exist',
            description: 'Timesheet already exist'
          };
          this.modalService.displayConfirmationModal(add, '528px', '300px').subscribe((value) => {
          });
        }
        }
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
