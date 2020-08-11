import { TestBed } from '@angular/core/testing';

import { CompanyPaymentTermsService } from './company-payment-terms.service';

describe('CompanyPaymentTermsService', () => {
  let service: CompanyPaymentTermsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(CompanyPaymentTermsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
