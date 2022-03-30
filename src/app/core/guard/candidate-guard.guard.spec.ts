import { TestBed } from '@angular/core/testing';

import { CandidateGuardGuard } from './candidate-guard.guard';

describe('CandidateGuardGuard', () => {
  let guard: CandidateGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    guard = TestBed.inject(CandidateGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
