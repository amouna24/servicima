import { TestBed } from '@angular/core/testing';

import { AssetsDataService } from './assets-data.service';

describe('AssetsDataService', () => {
  let service: AssetsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(AssetsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
