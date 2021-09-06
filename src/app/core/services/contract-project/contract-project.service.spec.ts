import { TestBed } from '@angular/core/testing';

import { ContractProjectService } from './contract-project.service';

describe('ContractProjectService', () => {
  let service: ContractProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(ContractProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
