import { TestBed } from '@angular/core/testing';

import { DynamicDataTableService } from './dynamic-data-table.service';

describe('DynamicDataTableService', () => {
  let service: DynamicDataTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(DynamicDataTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
