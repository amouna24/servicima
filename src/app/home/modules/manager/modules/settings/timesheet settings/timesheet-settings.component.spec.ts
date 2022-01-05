import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetSettingsComponent } from './timesheet-settings.component';

describe('TimesheetManagementComponent', () => {
  let component: TimesheetSettingsComponent;
  let fixture: ComponentFixture<TimesheetSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
