import { TestBed } from '@angular/core/testing';

import { ShareOnSocialNetworkService } from './shareonsocialnetwork.service';

describe('Shareonlinkedin.ServiceService', () => {
  let service: ShareOnSocialNetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(ShareOnSocialNetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
