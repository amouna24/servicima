import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetManagementComponent } from './timesheet-management.component';

describe('TimesheetManagementComponent', () => {
  let component: TimesheetManagementComponent;
  let fixture: ComponentFixture<TimesheetManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
