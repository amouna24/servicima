import { TestBed } from '@angular/core/testing';

import { CompanyTaxService } from './companyTax.service';

describe('CompanyTaxService', () => {
  let service: CompanyTaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(CompanyTaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
