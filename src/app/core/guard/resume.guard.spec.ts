import { TestBed } from '@angular/core/testing';

import { ResumeGuard } from './resume.guard';

describe('ResumeGuard', () => {
  let guard: ResumeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    guard = TestBed.inject(ResumeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
