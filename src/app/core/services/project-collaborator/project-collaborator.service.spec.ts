import { TestBed } from '@angular/core/testing';

import { ProjectCollaboratorService } from './project-collaborator.service';

describe('ProjectCollaboratorService', () => {
  let service: ProjectCollaboratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(ProjectCollaboratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
