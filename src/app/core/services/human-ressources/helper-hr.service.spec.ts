import { TestBed } from '@angular/core/testing';

import { HelperHrService } from './helper-hr.service';

describe('HelperHrService', () => {
  let service: HelperHrService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(HelperHrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
