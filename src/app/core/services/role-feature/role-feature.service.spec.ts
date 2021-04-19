import { TestBed } from '@angular/core/testing';

import { RoleFeatureService } from './role-feature.service';

describe('RoleFeatureService', () => {
  let service: RoleFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(RoleFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
