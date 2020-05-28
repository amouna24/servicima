import { TestBed } from '@angular/core/testing';

import { HttpErrorReqHandlerService } from './http-error-req-handler.service';

describe('HttpErrorReqHandlerService', () => {
  let service: HttpErrorReqHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorReqHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
