import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorReqHandlerService implements ErrorHandler {

  constructor() { }
  
  handleError(error: any): void {
    throw new Error("Method not implemented.");
  }
}
