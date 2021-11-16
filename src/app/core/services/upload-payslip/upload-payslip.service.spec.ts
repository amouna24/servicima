import { TestBed } from '@angular/core/testing';

import { UploadPayslipService } from './upload-payslip.service';

describe('UploadPayslipService', () => {
  let service: UploadPayslipService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(UploadPayslipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
