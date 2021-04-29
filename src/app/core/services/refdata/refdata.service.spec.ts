import { TestBed } from '@angular/core/testing';

import { RefdataService } from './refdata.service';

describe('RefdataService', () => {
  let service: RefdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(RefdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
