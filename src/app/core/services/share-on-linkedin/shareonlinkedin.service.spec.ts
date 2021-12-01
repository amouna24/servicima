import { TestBed } from '@angular/core/testing';

import { PostLinkedinService } from './shareonlinkedin.service';

describe('Shareonlinkedin.ServiceService', () => {
  let service: PostLinkedinService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(PostLinkedinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
