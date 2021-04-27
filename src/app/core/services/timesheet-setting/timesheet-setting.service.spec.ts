import { TestBed } from '@angular/core/testing';

import { TimesheetSettingService } from './timesheet-setting.service';

describe('TimesheetSettingService', () => {
  let service: TimesheetSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(TimesheetSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
