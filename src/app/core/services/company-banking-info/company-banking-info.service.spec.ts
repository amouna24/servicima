import { TestBed } from '@angular/core/testing';

import { CompanyBankingInfoService } from './company-banking-info.service';

describe('CompanyBankingInfoService', () => {
  let service: CompanyBankingInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(CompanyBankingInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
